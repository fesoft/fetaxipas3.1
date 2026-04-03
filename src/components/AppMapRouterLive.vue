<template>
  <q-dialog v-model="showDialog" maximized persistent @show="initMap">
    <q-card style="min-height: 80vh">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />

        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div id="map" style="height: 70vh; z-index: 1"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Importar ExtraMarkers para ícones personalizados
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers';
import { easyPrint } from 'leaflet-easyprint';
import { version } from 'leaflet/package.json';

// Corrigir caminho dos ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `https://unpkg.com/leaflet@${version}/dist/images/marker-icon-2x.png`,
  iconUrl: `https://unpkg.com/leaflet@${version}/dist/images/marker-icon.png`,
  shadowUrl: `https://unpkg.com/leaflet@${version}/dist/images/marker-shadow.png`,
});

const props = defineProps({
  show: Boolean,
  pickupCoords: { type: Array, default: () => [] },
  dropoffCoords: { type: Array, default: () => [] },
  desembCoords: { type: Array, default: () => [] },
  routePoints: { type: Array, default: () => [] },
  passengers: { type: Array, default: () => [] },
  legendData: { type: Array, default: () => [] },
  title: { type: String, default: 'Mapa da Viagem' },
  driverName: { type: String, default: '' },
  estimatedTime: { type: String, default: '' },
  estimatedDistance: { type: String, default: '' },
  remainingTime: { type: String, default: '' },
  remainingDistance: { type: String, default: '' },
  currentCarPosition: { type: Array, default: () => [] }
});

const showDialog = ref(false);
let map = null;
let routeLayer = null;
let carMarker = null;

onMounted(() => {
  showDialog.value = props.show;
});

const formatHour = (hourStr) => {
  if (hourStr && hourStr.includes(':')) {
    const [hours, minutes] = hourStr.split(':');
    return `${hours}:${minutes.padStart(2, '0')}`;
  }
  return hourStr;
};

// Computed para cores dos itens da legenda
const legendColors = computed(() => {
  const colors = [
    '#4CAF50', '#FF5252', '#2196F3', '#FFC107',
    '#9C27B0', '#FF9800', '#00BCD4', '#795548'
  ];
  return props.legendData.map((_, i) => colors[i % colors.length]);
});

// Controle de impressão
const printControl = L.easyPrint({
  title: 'Exportar como PNG',
  position: 'topleft',
  exportOnly: true,
  hideControlContainer: false,
  hideClasses: ['leaflet-control-easyPrint', 'leaflet-control-zoom'],
  sizeModes: ['A4Portrait', 'A4Landscape'],
  filename: props.title,
  tileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
});

// Função para calcular rota entre pontos
const calculateRoute = async () => {
  if (!props.currentCarPosition.length || !props.dropoffCoords.length) return;

  try {
    // Aqui você pode integrar com uma API de roteamento como OSRM
    // Por enquanto, vamos criar uma linha direta como exemplo
    const allPoints = [
      props.currentCarPosition,
      ...props.pickupCoords,
      ...props.desembCoords,
      ...props.dropoffCoords
    ].filter(point => point && point.length === 2);

    if (allPoints.length < 2) return;

    // Criar uma polilinha conectando todos os pontos
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    routeLayer = L.polyline(allPoints, {
      color: '#1976D2',
      weight: 5,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(map);

    // Ajustar o mapa para mostrar toda a rota
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [20, 20] });

  } catch (error) {
    console.error('Erro ao calcular rota:', error);
  }
};

// Criar ícone personalizado para o carro
const createCarIcon = () => {
  return L.ExtraMarkers.icon({
    icon: 'fa-car',
    markerColor: 'blue',
    shape: 'circle',
    prefix: 'fa'
  });
};

const initMap = () => {
  // Destruir mapa existente se necessário
  if (map) map.remove();

  // Criar mapa
  const initialCoords = props.currentCarPosition.length
    ? props.currentCarPosition
    : props.pickupCoords[0] ?? [-12.7172608, -38.330843];

  map = L.map('map').setView(initialCoords, 13);

  // Adicionar tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Adicionar controle de legenda
  addLegendControl();

  // Controle de impressão
  printControl.addTo(map);

  // Adicionar marcador da posição atual do carro
  if (props.currentCarPosition && props.currentCarPosition.length === 2) {
    carMarker = L.marker(props.currentCarPosition, {
      icon: createCarIcon(),
      zIndexOffset: 1000
    }).addTo(map)
      .bindPopup('<strong>Posição Atual do Veículo</strong>')
      .openPopup();
  }

  // Verificar e adicionar pontos de embarque
  if (Array.isArray(props.pickupCoords)) {
    props.pickupCoords.forEach((coords, index) => {
      const passenger = props.passengers[index] || {};
      const passengerName = passenger.NOME || 'Passageiro';
      const passengerHour = formatHour(passenger.EMB_HORA);
      const passengerId = passenger.PASSAGEIRO_ID || index + 1;

      if (coords && coords.length === 2) {
        L.marker(coords, {
          icon: L.ExtraMarkers.icon({
            icon: 'fa-user',
            markerColor: 'green',
            shape: 'circle',
            prefix: 'fa'
          })
        }).addTo(map)
          .bindPopup(`<strong>Embarque: ${passengerName} (${passengerId})<br>${passengerHour}</strong>`);
      }
    });
  }

  // Verificar e adicionar pontos de desembarque
  if (Array.isArray(props.desembCoords)) {
    props.desembCoords.forEach((coords, index) => {
      const passenger = props.passengers[index] || {};
      const passengerName = passenger.NOME || 'Passageiro';
      const passengerHour = formatHour(passenger.DESEMB_HORA);
      const passengerId = passenger.PASSAGEIRO_ID || index + 1;

      if (coords && coords.length === 2) {
        L.marker(coords, {
          icon: L.ExtraMarkers.icon({
            icon: 'fa-user',
            markerColor: 'orange',
            shape: 'circle',
            prefix: 'fa'
          })
        }).addTo(map)
          .bindPopup(`<strong>Desembarque: ${passengerName} (${passengerId})<br>${passengerHour}</strong>`);
      }
    });
  }

  if (Array.isArray(props.dropoffCoords)) {
    props.dropoffCoords.forEach((coords, index) => {
      if (coords && coords.length === 2) {
        L.marker(coords, {
          icon: L.ExtraMarkers.icon({
            icon: 'fa-flag-checkered',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
          })
        }).addTo(map)
          .bindPopup(`Ponto final`);
      }
    });
  }

  // Calcular e traçar a rota
  calculateRoute();

  // Calcular bounds para ajustar a visualização
  const allPoints = [
    props.currentCarPosition,
    ...(props.pickupCoords || []),
    ...(props.desembCoords || []),
    ...(props.dropoffCoords || [])
  ].filter(point => point && point.length === 2);

  if (allPoints.length > 0) {
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [20, 20] });
  } else {
    // Centro padrão se não houver pontos
    map.setView([-15.7801, -47.9292], 13);
  }

  // Forçar redimensionamento após um pequeno delay
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 100);
};

// Adicionar controle de legenda personalizado
const addLegendControl = () => {
  // Criar controle de legenda personalizado
  const legendControl = L.control({ position: 'bottomright' });

  legendControl.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'leaflet-legend-control');

    const legendItems = [
      { label: 'Motorista', value: props.driverName || 'Não informado' },
      { label: 'Passageiros', value: props.passengers.length.toString() },
      { label: 'Tempo Previsto', value: props.estimatedTime || 'Não calculado' },
      { label: 'Distância Prevista', value: props.estimatedDistance || 'Não calculada' },
      { label: 'Tempo Restante', value: props.remainingTime || 'Não calculado' },
      { label: 'Distância Restante', value: props.remainingDistance || 'Não calculada' }
    ];

    div.innerHTML = `
      <div class="map-legend">
        <div class="legend-header">${props.title}</div>
        <div class="q-list q-list--dense q-list--bordered rounded-borders">
          ${legendItems.map((item, index) => `
            <div class="q-item">
              <div class="q-item-section">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: ${legendColors.value[index % legendColors.value.length]}"></div>
                  <div class="legend-label">${item.label}:</div>
                  <div class="legend-value">${item.value}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return div;
  };

  // Adicionar ao mapa
  legendControl.addTo(map);
};

const cleanupMap = () => {
  if (map) {
    map.remove();
    map = null;
  }
  routeLayer = null;
  carMarker = null;
};

onBeforeUnmount(() => {
  cleanupMap();
});
</script>

<style>
/* Estilos para a legenda do Leaflet - AJUSTADOS */
.leaflet-legend-control {
  background-color: rgba(255, 255, 255, 0.6) !important;
  /* Quase sólido */
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
  border: 0px solid #0D47A1;
  min-width: 280px;
  /* Largura aumentada */
  max-width: 350px;
  /* Largura aumentada */
  z-index: 1000 !important;
  font-size: 15px;
}

.leaflet-legend-control .map-legend {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
}

.leaflet-legend-control .legend-header {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 0px solid #0D47A1;
  text-align: center;
  color: #0D47A1;
}

.leaflet-legend-control .legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaflet-legend-control .legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.leaflet-legend-control .legend-color {
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.leaflet-legend-control .legend-text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
}

.leaflet-legend-control .legend-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.leaflet-legend-control .legend-value {
  font-weight: 700;
  font-size: 1rem;
  color: #405675;
  margin-left: auto;
  padding-left: 10px;
}
</style>
