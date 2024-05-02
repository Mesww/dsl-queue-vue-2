<template>
  <v-data-table-server
    v-model:items-per-page="items_per_page"
    :headers="headers"
    :items="queue"
    :items-length="totalAllqueue"
    :loading="loading"
    @update:options="loadItems"
    style="width: 80vw; height: 70vh "
    class=" mb-10"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        class="me-2"
        size="small"
        color="blue"
        @click="callAction(item)"
        prepend-icon="mdi-room-service-outline"
      >
        เรียก
      </v-btn>
      <v-btn
        class="me-2"
        size="small"
        color="red"
        prepend-icon="mdi-cancel"
        @click="skipAction(item)"
      >
        ข้าม
      </v-btn>
      <v-btn
        size="small"
        color="green"
        @click="completeAction(item)"
        prepend-icon="mdi-account-check-outline"
      >
        เสร็จสิ้น
      </v-btn>
    </template>
  </v-data-table-server>
</template>


<script setup lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
let myChannel = ref(1);
let totalAllqueue = ref(0);
let is_called = ref(false);
let queue = ref([]);
const items_per_page = ref(5);
let loading = ref(false);
let timer = 10000;

let inter = setInterval(()=>{
fetchQueue();
},timer);


const headers = [
  { key: "queueid", title: "ลำดับ", align: "center" },
  { key: "datetime", title: "วันเวลา", align: "center" },
  { key: "type", title: "งานบริการ", align: "center" },
  { key: "studentID", title: "รหัสนักศึกษา", align: "center" },
  { key: "channel", title: "ช่องบริการ", align: "center" },
  { key: "actions", title: "งานบริการ", align: "center" },
];
fetchQueue();
console.log(process.env.VUE_APP_BACK_PORT);
async function fetchQueue() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueDataspecificstatusrefuse?status1=FINISH&status2=SKIP`
    );
    if (res.status === 200) {
      totalAllqueue.value = await res.data.length;
      queue.value = await res.data;
      queue.value.forEach((value) => {
        value.type = convertType(value.type);
      });
      loading.value = true;
      console.log("allqueue : ", res.data.length);
    } else {
      throw Error(`${res.status}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false; // Set loading to false after data is fetched
  }
}
console.log(queue.value);

function convertType(type: string): string {
  switch (type) {
    case "ONE":
      return "กยศ. (ลักษณะที่ 1)";
    case "TWO":
      return "กยศ. (ลักษณะที่ 2)";
    default:
      return "กยศ. (อื่นๆ)";
  }
}

async function loadItems(options: any) {
  // Here you can handle the options object which contains the pagination, sorting, and searching options.
  // For example, you can use these options to make a new API request with the updated parameters.
  console.log("Updated options:", options);
  // Example: Make a new API request using the updated options
  await fetchQueue();
}

async function checkIs_called() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?channel=${myChannel.value}&status=PROCESS`
    );
    if (res.status === 200) {
      console.log(res.data);
      console.log(res.data.length);
      if (res.data.length >= 1) {
        return true;
      }
      return false;
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

async function callAction(row: { queueid: number }) {
  console.log(row.queueid);
  console.log(myChannel);
  const is_called = await checkIs_called();
  if (is_called) {
    console.log(is_called);
    Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
  } else {
    try {
      const res = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateQueuechannel`,
        {
          queueid: row.queueid,
          channel: myChannel.value,
        }
      );
      // console.log(response);
      if (res.status === 200) {
        // find index qeueus
        const updatedItemIndex =
          queue.value?.findIndex((data) => data.queueid === row.queueid) ?? -1;
        console.log("success");
        if (queue.value && updatedItemIndex !== -1) {
          queue.value[updatedItemIndex].channel = myChannel.value;
          console.log(queue.value);
          console.log("success");
        }
      } else {
        throw Error(res.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function skipAction(row: { queueid: number }) {
  console.log(row.queueid);
  const is_called = await checkIs_called();
  try {
    // if (is_called) {
    //   Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
    //   return;
    // }
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueUpdatestatus`,
      {
        queueid: row.queueid,
        status: "SKIP",
      }
    );
    if (res.status === 200) {
      console.log("put OK");
  console.log(await checkIs_called());

      await fetchQueue();
      // await refreshNuxtData("queueconvert");
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
async function completeAction(row: { queueid: number }) {
  console.log(row);

  // if (is_called) {
  //     Swal.fire("โปรดทำคิวปัจจุบันให้เสร็จสิ้นก่อน");
  //     return;
  //   }

  try {
    const res = await axios.put(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueUpdatestatus`,
      {
        queueid: row.queueid,
        status: "FINISH",
      }
    );
    if (res.status === 200) {
      console.log("put OK");
      await fetchQueue();
      // await refreshNuxtData("queueconvert");
    } else {
      throw Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
onMounted(fetchQueue);

function start() {
  inter =  setInterval(()=>{
    fetchQueue();
  },timer)  
}

function stop(interval: number | undefined) {
  clearInterval(interval);
}
</script>

<style scope lang="scss"></style>
