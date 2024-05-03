<template>
  <div>
    <Bar
      v-if="$props.charttype === Charttype.Bar"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Bar,
  Bubble,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
} from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Chart } from "chart.js/dist";
import { ChartData,Charttype } from '../../models/Chart';

const props = defineProps({
  charttype: { type: Object as () => Charttype, required: true },
  data: { type: Object as () => ChartData, required: true },
});

let chartData = {
  labels: ["January", "February", "March"],
  datasets: [{ data: [40, 20, 12] }],
};
const chartOptions = {
  responsive: true,
};
</script>

<style scoped></style>
