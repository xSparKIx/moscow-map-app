<script setup>
import * as leaflet from 'leaflet';
import useMap from './composables/useMap';

const { mapData, createMap } = useMap();
</script>

<template>
  <div ref="map"></div>
</template>

<script>
export default {
  data() {
    return {
      // Массив с маркерами карты
      markers: [],
    };
  },

  props: {
    // Массив районов Москвы
    districts: {
      type: Array,
      default: () => [],
    },
    // Массив выбранных на диаграмме районов
    selectedDistricts: {
      type: Array,
      default: () => [],
    },
  },

  /**
   * После монтирования компонента создаем карту и добавляем на нее слой.
   */
  mounted() {
    this.createMap(this.$refs.map);
  },

  watch: {
    /**
     * Наблюдатель за изменением районов Москвы.
     *
     * При изменении точек в районах создаем новые маркеры и
     * вносим их в массив маркеров.
     */
    districts: {
      handler(districts) {
        this.clearAllMarkers();

        districts?.forEach((district, index) => {
          district?.points?.forEach(point => {
            const marker = new leaflet.marker([point[0], point[1]]).addTo(this.mapData);

            if (!this.markers[index]) this.markers[index] = [];
            this.markers[index].push(marker);
          });
        });
      },
      deep: true,
    },

    /**
     * Наблюдатель за изменением выбранных районов Москвы.
     *
     * При изменении выбранных районов скрываем невыбранные районы.
     */
    selectedDistricts: {
      handler() {
        this.hideUnselectedMarkers();
      },
      deep: true,
    },
  },

  methods: {
    /**
     * Метод очистки всех маркеров на карте.
     */
    clearAllMarkers() {
      this.markers?.forEach(district => {
        district?.forEach(marker => {
          marker?.remove();
        });
      });
    },

    /**
     * Метод скрытия невыбранных маркеров.
     */
    hideUnselectedMarkers() {
      this.districts?.forEach((district, index) => {
        const selected = this.selectedDistricts?.includes(district);

        this.markers[index]?.forEach(marker => {
          const isVisible = selected || !this.selectedDistricts?.length;
          marker?.setOpacity(+isVisible);
        });
      });
    },
  },
};
</script>
