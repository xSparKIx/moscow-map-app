<script setup>
import ChartMap from './components/ChartMap.vue';
import Chart from './components/Chart.vue';
import districtsJson from './assets/districts.json';
import pointInPolygon from 'point-in-polygon';
</script>

<template>
  <div class="container">
    <chart-map class="map" :districts="districts" :selectedDistricts="selectedDistricts" />
    <chart class="chart" :districts="districts" @change-points="selectDistrict" />
    <button @click="getPoints">Перегенерация координат</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Массив районов Москвы
      districts: [],
      // Массив выбранных на диаграмме районов
      selectedDistricts: [],
    };
  },

  methods: {
    /**
     * Метод получения 100 случайных точек на карте.
     */
    getPoints() {
      this.clearPoints();

      for (let i = 0; i < 100; i++) {
        const districtIndex = Math.floor(Math.random() * this.districts.length);
        const district = districtsJson?.features[districtIndex];
        const coords =
          district?.geometry?.type === 'MultiPolygon' ?
            district?.geometry?.coordinates[Math.floor(Math.random() * district?.geometry?.coordinates?.length)][0] :
            district?.geometry?.coordinates[0];

        const pointCoords = this.getRandomPoint(coords);

        this.districts[districtIndex]?.points?.push(pointCoords);
        this.districts[districtIndex].pointsCount++;
      }
    },

    /**
     * Метод получения случайной точки в пределах координат.
     *
     * @param {Array} coordinates - Массив с координатами, в пределах которых надо найти точку
     * @return {Array} - Возвращает координаты созданной точки
     */
    getRandomPoint(coordinates) {
      if (!coordinates) return;

      const x = coordinates.map(point => point[0]);
      const y = coordinates.map(point => point[1]);

      const minX = Math.min(...x);
      const minY = Math.min(...y);
      const maxX = Math.max(...x);
      const maxY = Math.max(...y);

      const lat = minY + (Math.random() * (maxY - minY));
      const lng = minX + (Math.random() * (maxX - minX));

      return pointInPolygon([lng, lat], coordinates) ? [lat, lng] : this.getRandomPoint(coordinates);
    },

    /**
     * Метод получения и преобразования округов Москвы
     */
    getDistricts() {
      this.districts = districtsJson?.features?.map(district => {
        return {
          ...district?.properties,
          // Точки в этом районе
          points: [],
          // Количество точек в этом районе
          pointsCount: 0,
        };
      });
    },

    /**
     * Метод очистки точек на карте
     */
    clearPoints() {
      this.selectedDistricts = [];

      this.districts?.forEach(district => {
        district.points = [];
        district.pointsCount = 0;
      });
    },

    /**
     * Метод выбора округа.
     *
     * @param {object} district - Объект, содержащий информацию о выбранном округе
     */
    selectDistrict(district) {
      !this.selectedDistricts?.includes(district) ?
        this.selectedDistricts?.push(district) :
        this.selectedDistricts?.splice(this.selectedDistricts?.findIndex(item => item.OKATO === district.OKATO), 1);
    },
  },

  /**
   * После монтирования компонента получаем список округов и их точек.
   */
  mounted() {
    this.getDistricts();
    this.getPoints();
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.container {
  display: grid;
  grid-template:
    "map map chart" 90%
    "map map button" 10%;
  height: 100vh;

  .map {
    grid-area: map;
  }

  .chart {
    grid-area: chart;
  }

  button {
    grid-area: button;
  }
}
</style>
