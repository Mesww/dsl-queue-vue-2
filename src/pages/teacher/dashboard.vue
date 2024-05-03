<template lang="">
  <div class="appdashboard">
    <IncTeacherSidebardark />
    <main>
      <!-- <UButton variant="solid" >Button</UButton> -->
      <!-- <div class="channel"> -->
      <div class="containers">
        <div class="channel-wrapper">
          <div class="channel">
            <div class="textchannel">ช่องรับบริการที่ 1</div>
            <div class="blockchannel">
              <v-img src="../../assets/Ellipse17.png" alt="Ellipse" />
              
              <v-img src="../../assets/image6.png" alt="Ellipse" />

              <div class="textchannel">{{ channel1 }}</div>
            </div>
          </div>

          <div class="channel">
            <div class="textchannel">ช่องรับบริการที่ 2</div>
            <div class="blockchannel">
              <v-img src="../../assets/Ellipse17.png" alt="Ellipse" />

              <v-img src="../../assets/image6.png" alt="Ellipse" />

              <div class="textchannel">{{ channel2 }}</div>
            </div>
          </div>

          <div class="channel">
            <div class="textchannel">ช่องรับบริการที่ 3</div>
            <div class="blockchannel">
              <v-img src="../../assets/Ellipse17.png" alt="Ellipse" />

              <v-img src="../../assets/image6.png" alt="Ellipse" />

              <div class="textchannel">{{ channel3 }}</div>
            </div>
          </div>
        </div>

        <div class="box-right">
          <div class="box-inside">
            <h1 class="channel-text">ช่องรับบริการที่ {{ lastchannel }}</h1>
          </div>
          <h1 class="q-text">คิวที่ {{ lastchannelqueueid }}</h1>
        </div>
        
      </div>
      <div v-if="is_over >= 250" class="text-250">จำนวนผู้ใช้บริการเกินกว่า 250 ท่าน</div>
    </main>
  </div>
  <!-- <div class="app bg-black h-screen">
        <Sidebar :items="sidebarItems">
          <template #item="{ item }">
            <nuxt-link :to="item.to">{{ item.text }}</nuxt-link>
          </template>
  </Sidebar>
  </div> -->
</template>
<script setup lang="ts">
import Swal from "sweetalert2";
import "animate.css";
import { useIntervalFn} from "@vueuse/core";
import { ref,onMounted } from "vue";
import axios from "axios";


let channel1 = ref(0);
let channel2 = ref(0);
let channel3 = ref(0);
let lastchannel = "";
let lastchannelqueueid = ref(0);
let is_over = ref(0)

// getQueue();
function convertChannel(data: string) {
  switch (data) {
    case "WAIT":
      data = "ยังไม่ได้เรียก";
      break;
    case "ONE":
      data = "1";
      break;
    case "TWO":
      data = "2";
      break;
    case "THREE":
      data = "3";
      break;
    default:
      break;
  }
  return data;
}
/// 250
function updateQueueClass(allQueues: any[]) {
  const divElement = document.querySelector(".text-250");
  if (divElement) {
    if (allQueues.length < 250) {
      divElement.classList.remove("text-250");
    } else {
      divElement.classList.add("text-250");
    }
  }
}
async function getQueue() {
    try {
        const queue = await axios.get(`http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueue`);
        if (queue.status !== 200) {
            throw Error(queue.statusText);
        }
      is_over.value = queue.data.length - 1;
      console.log(is_over.value);
        queue.data.forEach((value: { channel: number; orders: any }) => {
      if (value.channel === 1) {
        channel1.value = value.orders;
      } else if (value.channel === 2) {
        channel2.value = value.orders;
      } else if (value.channel === 3) {
        channel3.value = value.orders;
      }
      let lastqueue = queue.data.findLast(
      (item: { status: string }) => item.status === "PROCESS"
    );
    if (lastqueue !== undefined && lastqueue !== null) {
      console.log(lastqueue?.channel);

      lastchannel = lastqueue.channel;
      lastchannelqueueid.value = lastqueue.orders;
    }
    });
    } catch (error) {
        console.error(error);
    }
}

onMounted(getQueue);

// Call getQueue() every 1 minute
setInterval(getQueue, 5000);
</script>
<style lang="scss" scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.appdashboard {
  display: flex;

  main {
    padding: 2rem;
    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
    .containers {
      display: flex;
    }
    overflow: scroll;
  }
}

.channel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  .channel {
    margin: 2rem;

    .blockchannel {
      border: 1px solid black;
      border-radius: 2rem;
      padding: 1.5rem 2rem;
      width: 10rem;
      height: 22rem;
    }

    v-img {
      width: 300px;
      height: 100px;
      padding: 1%;
      margin-bottom: 35%;
      box-sizing: border-box;
    }

    .blockchannel v-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      width: auto;
    }

    .textchannel {
      margin-left: 0.7rem;
      margin-bottom: 0.5rem;
      font-family: "Inter-Bold", Helvetica;
      color: #000000;
      font-weight: 700;
      text-align: center;
    }
  }
}

.box-right {
  border-bottom-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  margin: 2rem 2.5rem;
  width: 40rem;
  height: 30rem;
  margin: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #2958c8;

  .channel-text {
    padding: 1.5rem;
    font-size: 1.5rem;
    font-weight: 200;
    font-family: "Inter-Bold", Helvetica;
  }

  .box-inside {
    width: 40rem;
    height: 5rem;
    background-color: #1844ab;
  }

  .q-text {
    padding-top: 5rem;
    text-align: center;
    font-size: 7rem;
    font-weight: 700;
    font-family: "Inter-Bold", Helvetica;
  }
}

.text-250 {
  color: #ff0707;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 2rem;
  animation: blink 5s linear infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
  80% {
    opacity: 0.5;
  }
}
</style>
