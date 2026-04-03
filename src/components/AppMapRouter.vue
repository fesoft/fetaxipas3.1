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
  title: { type: String, default: 'Mapa da Viagem' }
});

const showDialog = ref(false);
let map = null;


onMounted(() => {
  showDialog.value = props.show;
});
const formatHour = (hourStr) => {

    const hours = hourStr.split(':')[0];
    const minutes = hourStr.split(':')[1];
    return `${hours}:${minutes.padStart(2, '0')}`;

  return hourStr; // Retornar como está se não estiver no formato esperado
};
// Computed para cores dos itens da legenda
const legendColors = computed(() => {
  const colors = [
    '#4CAF50', '#FF5252', '#2196F3', '#FFC107',
    '#9C27B0', '#FF9800', '#00BCD4', '#795548'
  ];
  return props.legendData.map((_, i) => colors[i % colors.length]);
});
// Faixas de velocidade com cores
const speedRanges = [
  { min: 0, max: 40, color: '#4CAF50', label: '0-40' },
  //{ min: 21, max: 40, color: '#8BC34A', label: '21-40' },
  { min: 41, max: 60, color: '#FFEB3B', label: '41-60' },
  { min: 61, max: 80, color: '#FF9800', label: '61-80' },
  { min: 81, max: 100, color: '#F44336', label: '81-100' },
  { min: 101, max: 120, color: '#9C27B0', label: '101 - 120' },
  { min: 121, max: 999, color: '#740787', label: '120+' }
];

// Obter cor baseada na velocidade
const getSpeedColor = (speed) => {
  const range = speedRanges.find(r => speed >= r.min && speed <= r.max);
  return range ? range.color : '#9E9E9E';
};
// Função para criar uma rota com borda
const createBorderedPolyline = (latlngs, options = {}, avgSpeed) => {
  // Configurações padrão
  const defaults = {
    color: '#3498db',
    borderColor: '#9E9E9E',
    weight: 6,
    borderWidth: 3,
    dashArray: null
  };

  // Mesclar opções
  const config = { ...defaults, ...options };

  // Criar a borda (linha mais grossa)
  const border = L.polyline(latlngs, {
    color: config.borderColor,
    weight: config.weight + (config.borderWidth * 2),
    opacity: 1,
    //lineCap: 'round',
    //lineJoin: 'round',
    dashArray: config.dashArray
  });

  // Criar a linha principal
  const line = L.polyline(latlngs, {
    color: config.color,
    weight: config.weight,
    opacity: 1,
    //lineCap: 'round',
    //lineJoin: 'round',
    dashArray: config.dashArray
  });
  line.bindPopup(`Velocidade média: ${avgSpeed.toFixed(1)} km/h`);
  // Criar um grupo para as duas linhas
  const group = L.layerGroup([border, line]);

  return {
    group: group,
    border: border,
    line: line,
    latlngs: latlngs,
    options: config
  };
};

// Controle de impressão
const printControl = L.easyPrint({
  title: 'Exportar como PNG',
  position: 'topleft',
  exportOnly: true,
  hideControlContainer: false,
  hideClasses: ['leaflet-control-easyPrint', 'leaflet-control-zoom'], // Ocultar controles durante impressão
  sizeModes: ['A4Portrait', 'A4Landscape'],
  filename: props.title,
  tileLayer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
})


const initMap = () => {
  // Destruir mapa existente se necessário
  if (map) map.remove();

  // Criar mapa
  map = L.map('map').setView(props.pickupCoords[0] ?? [-12.7172608, -38.330843], 13);

  // Adicionar tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  // Adicionar controle de legenda
  addLegendControl();
  // Controle de impressão
  printControl.addTo(map);
  // Adicionar controle de legenda


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
          .bindPopup(`<strong>${passengerName} (${passengerId})<br>${passengerHour}</strong>  `)
          .openPopup()

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
          .bindPopup(`<strong>${passengerName} (${passengerId})<br>${passengerHour}</strong>  `)
          .openPopup()

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
        })
          .bindPopup(`Ponto final`)
          .addTo(map);
      }
    });
  }
  // Adicionar rota com cores baseadas na velocidade
  if (Array.isArray(props.routePoints) && props.routePoints.length > 1) {
    // Criar segmentos de cor baseados na velocidade
    const segments = [];
    let currentSegment = [];

    for (let i = 0; i < props.routePoints.length; i++) {
      const point = props.routePoints[i];
      const speed = point.speed || 0;

      if (currentSegment.length === 0) {
        currentSegment.push(point);
        continue;
      }

      const lastPoint = currentSegment[currentSegment.length - 1];
      const lastSpeed = lastPoint.speed || 0;

      // Se a velocidade mudou significativamente, inicia novo segmento
      if (Math.abs(speed - lastSpeed) > 5 && currentSegment.length > 0) {
        segments.push([...currentSegment]);
        currentSegment = [lastPoint, point];
      } else {
        currentSegment.push(point);
      }
    }

    // Adicionar o último segmento
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    // Desenhar cada segmento com sua cor
    segments.forEach(segment => {
      if (segment.length < 2) return;

      const avgSpeed = segment.reduce((sum, p) => sum + (p.speed || 0), 0) / segment.length;
      const color = getSpeedColor(avgSpeed);

      const points = segment.map(p => [p.lat, p.lng]);

      /*const polyline = L.polyline(points, {
        color,
        weight: 8,
        opacity: 1.0
      }).addTo(map);
      */
      const polyline = createBorderedPolyline(points, {
        color: color,
        borderColor: '#9e9e9e',
        weight: 6,
        borderWidth: 2,
        dashArray: null
      }, avgSpeed);

      polyline.group.addTo(map);


    });
  }
  /*
    // Verificar e adicionar rota
    if (Array.isArray(props.routePoints) && props.routePoints.length > 1) {
      L.polyline(props.routePoints, {
        color: '#1976D2',
        weight: 5,
        opacity: 0.7
      }).addTo(map);
    }
  */
  // Calcular bounds para ajustar a visualização
  const allPoints = [
    ...(props.pickupCoords || []),
    ...(props.dropoffCoords || []),
    ...(props.routePoints || [])
  ].filter(point => point && point.length === 2);

  if (allPoints.length > 0) {
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds);
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
  // Só adicionar se houver dados na legenda
  if (!props.legendData || props.legendData.length === 0) return;

  // Criar controle de legenda personalizado
  const legendControl = L.control({ position: 'bottomright' });

  legendControl.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'leaflet-legend-control');
    div.innerHTML = `
      <div class="map-legend">
        <div class="legend-header">${props.title}</div>
        <div class="q-list q-list--dense q-list--bordered rounded-borders">
          ${props.legendData.map((item, index) => `
            <div class="q-item">
              <div class="q-item-section">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: ${legendColors.value[index]}"></div>
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
