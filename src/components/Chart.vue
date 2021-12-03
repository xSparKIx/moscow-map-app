<script setup>
import * as am5 from "@amcharts/amcharts5"
import * as am5percent from "@amcharts/amcharts5/percent"
import am5themes_Animated from "@amcharts/amcharts5/themes/animated";

function createPieChart(data) {
  if (!data) return

  const root = am5.Root.new(this.$refs.chart)

  root.setThemes([
    am5themes_Animated.new(root)
  ]);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {})
  );

  // Create series
  const series = chart.series.push(
    am5percent.PieSeries.new(root, {
      name: "Series",
      valueField: "pointsCount",
      categoryField: "NAME",
      alignLabels: false,
    })
  );

  series.slices.template.events.on("click", event => this.$emit('change-points', event?.target?.dataItem?.dataContext))

  series.data.setAll(data);

  series.labels.template.setAll({
    fontSize: 12,
    text: "{category}",
    textType: "radial",
    radius: 0,
    centerX: am5.percent(100),
    fill: am5.color(0xffffff),
  })

  // Костыль, возможно поправить
  this.chart = series
}

function updatePieChart(data) {
  this.chart.data.setAll(data)
}
</script>

<script>
export default {
  data() {
    return {
      chart: {},
    }
  },

  props: {
    districts: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    districts: {
      handler(val) {
        // Подумать как лучше а то костыльно
        this.chart?.uid ? this.updatePieChart(val) : this.createPieChart(val)
      },
      deep: true,
    },
  },
}
</script>

<template>
  <div ref="chart"></div>
</template>