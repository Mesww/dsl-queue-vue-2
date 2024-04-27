<template>
    <div>
        <Googlebutton @click="login"/>
    </div>
</template>

<script setup lang="ts">

import Googlebutton from '../widget/loginbutton.vue';
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
const google_client_id = process.env.VUE_APP_GOOGLE_CLIENT_ID;
// console.log(google_client_id);
// function alerts() {
//     alert("test");
// }
async function login() {
    // alert(google_client_id);
    googleSdkLoaded((google:any) =>{
    google.accounts.oauth2.initCodeClient({
        client_id: google_client_id,
        // client_secret: google_client_secret
         scope: "email profile openid",
            redirect_uri: "http://localhost:8888/auth/callback",
            callback: (response: { code: any; }) => {
              if (response.code) {
                 sendCodeToBackend(response.code);
                // console.log( response.code);
                
              }
            }
    }).requestCode();        
    });
}
async function sendCodeToBackend(code:string) {
    try {
        const headers = {
          Authorization: code
        };
        const response = await axios.post("http://localhost:8888/login/google", null, { headers });
        const userDetails = response.data;
        console.log("User Details:", userDetails);
        // userDetails = userDetails;

        // Redirect to the homepage ("/")
        //this.$router.push("/rex");
      } catch (error) {
        console.error("Failed to send authorization code:", error);
      }
}

</script>

<style scoped>

</style>