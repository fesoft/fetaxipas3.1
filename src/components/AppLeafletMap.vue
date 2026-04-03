<template>
  <div>
    <q-btn
    @click="$emit('handle')"
    label="RECARREGAR"
    color="secondary"
    >
    <q-separator />
  </q-btn>
    <div id="mapContainer" />
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default defineComponent({
  name: 'AppLeafletMap',
  props: {
    markers: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup (props) {
    let map = null

    onMounted(() => {
      console.log(props.markers)
      createMapLayer()
    })

    onBeforeMount(() => {
      if (map) {
        map.remove()
      }
    })

    const createMapLayer = () => {
      map = L.map('mapContainer').setView([-12.713009, -38.317616], 10)
      L.Marker.prototype.options.icon = L.icon({
        iconUrl: "icons/marker-icon.png",
        shadowUrl: "icons/marker-shadow.png"
      });

      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      if (props.markers.length) {
        setMarkers()
      }
    }

    const setMarkers = () => {
      props.markers.map((marker) => {
        return L.marker([marker.latitude, marker.longitude],
          {
            title: marker.title
          })
        .addTo(map)
        .bindPopup(marker.title)
      })
    }
  }
})
</script>

<style scoped>
#mapContainer {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
