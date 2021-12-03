<script setup>
import "leaflet/dist/leaflet.css"
import "leaflet"
import districtsJson from "../assets/districts.json"
</script>

<template>
  <div id="map"></div>
</template>

<script>
export default {
  data() {
    return {
      map: "",
      markers: [],
    }
  },

  props: {
    districts: {
      type: Array,
      default: () => [],
    },
    selectedDistricts: {
      type: Array,
      default: () => [],
    },
  },

  mounted() {
    const mapboxAccessToken = "pk.eyJ1IjoicG9zZWxhIiwiYSI6ImNrd282bHh0aTJjczgyd21kYW1uemg2eDgifQ.6Tiz4FW5BBjAdzj_bpvsQA";
    const map = L.map('map').setView([55.7522200, 37.6155600], 10);

    // Возможно костыль и возможно убрать
    this.map = map

    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    L.geoJson(districtsJson).addTo(map);
  },

  watch: {
    districts: {
      handler(districts) {
        this.clearAllPoins()

        districts?.forEach((district, index) => {
          district?.points?.forEach(point => {
            // Может разделить на группы https://leafletjs.com/reference.html#layergroup
            const marker = new L.marker([point[0], point[1]]).addTo(this.map);

            if (!this.markers[index]) this.markers[index] = []
            this.markers[index].push(marker)
          });
        })
      },
      deep: true,
    },
    selectedDistricts: {
      handler() {
        this.hideUnselectedPoints()
      },
      deep: true,
    },
  },

  methods: {
    clearAllPoins() {
      this.markers?.forEach(district => {
        district?.forEach(marker => {
          marker?.remove()
        })
      })
    },
    hideUnselectedPoints() {
      this.districts?.forEach((district, index) => {
        const selected = this.selectedDistricts?.includes(district)
        
        this.markers[index]?.forEach(marker => {
          const isVisible = selected || !this.selectedDistricts.length
          marker?.setOpacity(+isVisible)
        })
      });
    },
  },
}
</script>