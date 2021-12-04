<script setup>
import usePieChart from './composables/usePieChart';

const { chartData, createPieChart, updatePieChart } = usePieChart();
</script>

<template>
  <div ref="chart"></div>
</template>

<script>
export default {
  props: {
    // Массив районов Москвы
    districts: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    // Наблюдатель за изменением районов Москвы
    districts: {
      handler(districts) {
        this.chartData?.uid ?
          this.updatePieChart(districts) :
          this.createPieChart(this.$refs.chart, districts, 'pointsCount', 'NAME');
      },
      deep: true,
    },
  },
};
</script>
