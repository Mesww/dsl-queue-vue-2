<template>
  <div class="flex justify-center w-screen main-wrapper">
    <main
      class="grid grid-cols-2 gap-4 "
    >
    <cards v-if="loading === false" card-color="white" :data="chartData[0]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[1]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[2]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[3]" />
    </main>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import cards from "../../components/admin/home.content.vue";
import { ChartData, Charttype } from "../../models/Chart";
// import { Queue } from '../../models/Queue';
import { History } from "../../models/History";
import { onMounted, Ref, ref } from "vue";
let queueToday: Ref<History[]> = ref([]);
let today = new Date(Date.now());
let history : Ref<History[]> = ref([]);
let loading = ref(true);
let chartData: Ref<ChartData[]> = ref([]);
async function getAllQueue() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistory`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    console.log(res.data);
    history.value = res.data;
    res.data.forEach((value: History) => {
      value.datetime = new Date(value.datetime);
      // ! Queue today
      if (value.datetime.getDate() === today.getDate()) {
        queueToday.value.push(value);
      }
    });
    // console.log("Queue today", queueToday.value);

    const hourCounts: number[] = [];
    for (let i = 8; i <= 16; i++) {
      const count = filterDataByHour(i, queueToday.value);
      hourCounts.push(count);
    }

    const finish = queueToday.value.filter((value) => {
      return value.status === "FINISH";
    });
    const notFinish = queueToday.value.filter((value) => {
      return (
        value.status !== "FINISH" &&
        value.status !== "SKIP" &&
        value.status !== "CANCEL"
      );
    });

    const one = history.value.filter((value)=>{
      return value.type === "ONE"
    })
    const two = history.value.filter((value)=>{
      return value.type === "TWO"
    })
    const three = history.value.filter((value)=>{
      return value.type === "THREE"
    })

    let rateone =0;
    let ratetwo =0;
    let ratethree =0;
    for (let index = 0; index < history.value.length; index++) {
      if (history.value[index].type === "ONE") {
        rateone = (history.value[index].rate + rateone)/one.length;
      }else if (history.value[index].type === "TWO"){
        ratetwo = history.value[index].rate + ratetwo/two.length;
      }else if (history.value[index].type ==="THREE"){
        ratethree = history.value[index].rate + ratethree/three.length;
      }
    }
    

    chartData.value = [
      {
        type: Charttype.Bar,
        title: "คะแนน เฉลี่ย ",
        labels: [
          "แบบคำขอกกู้ยืมเงิน",
          "สัญญากู้ยืมเงิน",
          "ประเภทอื่น ๆ",
        ],
        datasets: [
          {
            data: [rateone, ratetwo, ratethree],
            label: "",
            backgroundColor: ["#191770","red","black"],
          },
        ],
      },
      {
        type: Charttype.Doughnut,
        title: `All queue today ${queueToday.value.length}`,
        labels: ["Finish", "Not Finish"],
        datasets: [
          {
            data: [finish.length, notFinish.length],
            label: "",
            backgroundColor: ["#191770", "red"],
          },
        ],
      },
      {
        type: Charttype.Line,
        title: `Queue today ${queueToday.value.length}`,
        labels: [
          ` 08:00`,
          ` 09:00`,
          ` 10:00`,
          ` 11:00`,
          ` 12:00`,
          ` 13:00`,
          ` 14:00`,
          ` 15:00`,
          ` 16:00`,
        ],
        datasets: [
          {
            data: hourCounts,
            label: `${today.toDateString()}`,
            backgroundColor: ["#191770"],
          },
        ],
        chartOption: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "เวลา",
              },
            },
            y: {
              title: {
                display: true,
                text: "ความยาวของคิว",
              },
              beginAtZero: true,
            },
          },
        },
      },
      {
        type: Charttype.Pie,
        title: "Test 4",
        labels: ["January", "February", "March"],
        datasets: [
          {
            data: [40, 20, 12],
            label: "test bar 2",
            backgroundColor: ["#191770"],
          },
        ],
      },
    ];

    loading.value = false;
    console.log(loading.value);
  } catch (error) {
    console.error(error);
  }
}

// Function to filter data by hour and count its length
function filterDataByHour(hour: number, data: History[]): number {
  const filteredData = data.filter((entry) => {
    const entryDate = new Date(entry.datetime);
    return entryDate.getHours() === hour;
  });
  return filteredData.length;
}

onMounted(getAllQueue);
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: calc(100vh - 11.5rem);
  main {
    overflow: scroll;
    padding: 1rem;
    margin: 1rem 0 0rem 0;
    
  }
}
</style>
