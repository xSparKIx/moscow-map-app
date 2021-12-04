<script setup>
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/animated';
</script>

<template>
  <div ref="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      // Ссылка на диаграмму
      chart: {},
    };
  },

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
        this.chart?.uid ?
          this.updatePieChart(districts) :
          this.createPieChart(this.$refs.chart, districts, 'pointsCount', 'NAME');
      },
      deep: true,
    },
  },

  methods: {
    /**
     * Метод создания круговой диаграммы.
     *
     * @param {object|string} ref - Ссылка на элемент или id элемента, в который добавляем диаграмму
     * @param {Array} data - Массив районов Москвы
     * @param {string} valueField - Наименование параметра объекта, содержащего значения секторов
     * @param {string} categoryField - Наименование параметра объекта, содержащего наименования секторов
     */
    createPieChart(ref, data, valueField, categoryField) {
      if (!ref || !data || !valueField || !categoryField) return;

      const root = am5.Root.new(ref);

      root.setThemes([
        am5themes_Animated.new(root),
      ]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {}),
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: 'Series',
          valueField,
          categoryField,
          alignLabels: false,
        }),
      );

      const seriesTemplate = series.slices.template;
      seriesTemplate?.events.on('click', event => this.$emit('change-points', event?.target?.dataItem?.dataContext));

      series.data.setAll(data);

      series.labels.template.setAll({
        fontSize: 12,
        text: '{category}',
        textType: 'radial',
        radius: 0,
        centerX: am5.percent(100),
        fill: am5.color(0xffffff),
      });

      // TODO: Возможно убрать
      this.chart = series;
    },
    /**
     * Метод обновления данных круговой диаграммы.
     *
     * @param {Array} data - Массив районов Москвы
     */
    updatePieChart(data) {
      this.chart?.data?.setAll(data);
    },
  },
};
</script>
