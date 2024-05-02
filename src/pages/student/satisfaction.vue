<script lang="ts" setup>
import { onMounted, ref} from "vue";
import navbars from "../../components/student/satisfaction.navbar.vue";
import Swal from "sweetalert2";
import axios from "axios";

import { useCookies } from "vue3-cookies";
import router from "@/router";

const { cookies } = useCookies();

const accesstoken = cookies.get("accesstoken");
const access_token_extract = parseJwt(accesstoken);
const studentID = access_token_extract.email.split("@")[0];
let myqueues = ref([])

let selectedValue = ref([
  { Question: "โปรดให้คะแนนความพึงพอใจการให้บริการ", value: 1 },
]);

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function getMyqueue() {
  try {
    
    const res = await axios.get(`http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?studentID=${studentID}`);
    if (res.status!== 200) {
      throw Error(res.statusText);
    }
    myqueues.value = res.data[0];

  } catch (error) {
    console.error(error);
  }
}

async function submit() {
    // console.log('test');
    console.log(selectedValue.value);
    await Swal.fire({
      icon: "success",
      title: "ขอบคุณที่มาใช้บริการ",
      showConfirmButton: false,
      timer:1500,
      
    })
    await createHistory();
    try {
      const res = await axios.delete(`http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueuedeleteQueue?queueid=${myqueues.value.queueid}`);
        if (res.status !== 200) {
          // navigateTo("/student/", { replace: true });
          throw Error(res.statusText);
        }
        router.push({name:"student",replace:true})
      
    } catch (error) {
      console.error(error);
    }
  }
  
  async function createHistory() {
    // console.log(userid.value + myqueues.value.type + myqueues.value.rate + myqueues.value.comment + myqueues.value.channel);
    try {
      const response = await axios.post(`http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistoryCreate`, {
         type: myqueues.value.type, studentid:myqueues.value.studentID, rate: selectedValue.value[0].value, comment: myqueues.value.comment, channel: myqueues.value.channel },
      );
      console.log(response);
      if (response.status === 200 ) {
        console.log(response);
        console.log("CREATED");
        // setData("is_reserve", true);
        // const queueid = useCookie('myqueueid');
        // queueid.value = response.queueid;
        // is_reserve.value = true;
        // navigateTo("/student/main", { replace: true });
      } else {
        throw Error("Connection error");
      }
    } catch (error) {
      console.error(error);
    }
  }
onMounted(getMyqueue);
</script>

<template>
  <div class="bg">
    <navbars />
    <div class="raiting flex flex-col justify-center items-center">
      <div
        class="flex justify-center"
        v-for="(question, index) in selectedValue"
        :key="index"
      >
        <div class="rounded-md bg-white box mt-5 p-5 d-flex">
          <div>
            <p>{{ index + 1 }}. {{ question.Question }}</p>
            <div class="flex justify-between">
              <v-slider
              v-model="selectedValue[index].value"
                :step="1"
                max="5"
                min="1"
                show-ticks="always"
                thumb-label="always"
              />
              <p>{{ selectedValue[index].value }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center my-5">
        <v-btn
          rounded="xl"
          class="submitButton"
          icon="i-heroicons-arrow-right-circle-16-solid"
          @click="submit"
          >Submit</v-btn
        >
      </div>
    </div>
  </div>
</template>

<!-- <script lang="ts" setup>
  import Swal from "sweetalert2";
  import "animate.css";
  
  console.log(userid.value);
  const {data:user} = await useFetch(`/api/user/user?userid=${userid.value}`);
  console.log(user.value);
  
  
  const studentID = user.value?.studentid;
  const { data: myqueues, pending } = await useLazyAsyncData<{
    queueid: number;
    datetime: string;
    studentID: string;
    type: string;
    orders: number;
    channel: string;
    status: string;
    rate: number;
    comment: string;
  }>(
    "queue",
    () =>
      $fetch("/api/queue/queueDataspecific", {
        method: "post",
        body: {
          studentID: studentID,
        },
      })
  
  );
  
  let selectedValue = ref([
    { Question: "โปรดให้คะแนนความพึงพอใจการให้บริการ", value: 0 },
  ]);
  // console.log(value.model-value);
  // import { IncStudentsRatingform } from '#build/components';
  async function submit() {
    // console.log('test');
    console.log(selectedValue.value);
    await Swal.fire({
      icon: "success",
      title: "ขอบคุณที่มาใช้บริการ",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
    await createHistory();
    const res = await $fetch('/api/queue/queueDelete',{
        method:"DELETE",
        body:{
          queueid: parseInt(myqueueid.value)
        }
      });
      if (res === "Delete!") {
        myqueueid.value = null;
        is_reserve.value = null;
        navigateTo("/student/", { replace: true });
      }
  }
  
  async function createHistory() {
    console.log(userid.value + myqueues.value.type + myqueues.value.rate + myqueues.value.comment + myqueues.value.channel);
    try {
      const response = await $fetch("/api/history/historyCreate", {
        method: "post",
        body: { type: myqueues.value.type, studentid:myqueues.value.studentID, rate: myqueues.value.rate, comment: myqueues.value.comment, channel: myqueues.value.channel },
      });
      console.log(response);
      if (response !== null ) {
        console.log(response);
        console.log("CREATED");
        // setData("is_reserve", true);
        // const queueid = useCookie('myqueueid');
        // queueid.value = response.queueid;
        // is_reserve.value = true;
        // navigateTo("/student/main", { replace: true });
      } else {
        throw Error("Connection error");
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  </script> -->

<style lang="scss" scoped>
.bg {
  background-color: #191771;
  height: 100vh;
  overflow: scroll;
}
.submitButton {
  background-color: #f1f5f9;
  color: #191771;
  display: flex;
  justify-content: center;
  width: 80vw;
}
.submitButton:hover {
  background-color: #ed1c24;
  color: #f1f5f9;
  overflow: hidden;
}

.box {
  width: 80vw;
  color: #191771;
  border-radius: 1.5rem;
  .range {
    margin-top: auto;
    margin-bottom: auto;
    width: 60vw;
  }
}
</style>
