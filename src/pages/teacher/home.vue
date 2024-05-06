<template>
  <div class=" m-auto ">
    <div class="flex justify-between">
      <v-switch color="red" @click="breakAlert" v-model="tooglevalue" hide-details />
      <div class="head items-center md:flex" > <h1 class=" text-white py-5 px-3"> ช่องบริการที่ {{myChannel}}</h1> </div>

    </div>
      <queuetable />
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import queuetable from "../../components/teacher/home.table.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
let tooglevalue = ref(true);
async function breakAlert() {
  const result = await Swal.fire({
    title: "คุณแน่ใจใช่ไหม?",
    text: "คุณกำลังจะพักระบบ!",
    icon: "warning",
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    cancelButtonText: "ยกเลิก",
    iconColor: "#ED1C24",
    color: "#191771",
  });

  if (result.isConfirmed) {
    //Change Status WAIT to STOP
    try {
      const res = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateAllQueuestatus`,
        {
          changeStatus: "WAIT",
          status: "STOP",
        }
      );
      if (res.status !== 200) {
        throw Error(res.statusText);
      }
      tooglevalue.value = false;

      const results = await Swal.fire({
        title: "กำลังพักระบบ!",
        html: '<div class="spin-loader"></div>',
        showCancelButton: true,
        showConfirmButton: false,
        reverseButtons: true,
        allowOutsideClick: false, // Prevent dismissing by clicking outside the modal
        allowEscapeKey: false, // Prevent dismissing by pressing the Escape key
        allowEnterKey: false, // Prevent dismissing by pressing the Enter key
        customClass: {
          htmlContainer: "spin-swal-container",
        },
        showClass: {
          popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `,
        },
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "#ED1C24",
        color: "#191771",
      });
      if (results.dismiss || results.isDenied) {
        tooglevalue.value = true;
        try {
            const ress = await axios.put(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueupdateAllQueuestatus`,
        {
          changeStatus: "STOP",
          status: "WAIT",
        }
      );
      if (ress.status !== 200) {
        console.error(ress.statusText);
      }
        } catch (error) {
            console.error(error);
        }

      }
    } catch (error) {
      console.error(error);
    }
  }
  tooglevalue.value = true;
  console.log(tooglevalue.value);
}

import { useCookies } from "vue3-cookies";
let myChannel =ref(0);


const { cookies } = useCookies();
const accesstoken = cookies.get("accesstoken");
const access_token_extract = parseJwt(accesstoken);
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
async function getMyuser() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getSpecificuser?email=${access_token_extract.email}`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    myChannel.value = res.data.channel;
    console.log("mychannel ", myChannel);
  } catch (error) {
    console.error(error);
  }
}
onMounted(getMyuser);




</script>

<style lang="scss" scoped>
.swal2-container .swal2-html-container {
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
}
.spin-swal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spin-loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #191771; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spins 1s linear infinite;
}

@keyframes spins {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
