import { ref } from 'vue';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/animated';

/**
 * Функция композиции круговой диаграммы.
 *
 * @returns {object} - Возвращает набор методов и параметров диаграмм
 */
export default function usePieChart() {
  // Ссылка на диаграмму
  const chartData = ref({});

  /**
   * Метод создания круговой диаграммы.
   *
   * @param {object|string} ref - Ссылка на элемент или id элемента, в который добавляем диаграмму
   * @param {Array} data - Массив районов Москвы
   * @param {string} valueField - Наименование параметра объекта, содержащего значения секторов
   * @param {string} categoryField - Наименование параметра объекта, содержащего наименования секторов
   */
  function createPieChart(ref, data, valueField, categoryField) {
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

    chartData.value = series;
  }

  /**
   * Метод обновления данных круговой диаграммы.
   *
   * @param {Array} data - Массив районов Москвы
   */
  function updatePieChart(data) {
    chartData.value?.data?.setAll(data);
  }

  return {
    chartData,
    createPieChart,
    updatePieChart,
  }
}