<template lang="">
    <div class="app">
      <main>
        <div class="flex justify-center">
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            class=" "
            style="color: white"
            variant="underlined"
            color="white"
            hide-details
            single-line
          ></v-text-field>
        </div>
        <div class="abutton">
          <button class="btn" @click="getAllhistory">
            รายการผู้รับบริการทั้งหมด
          </button>
          <button class="btn" @click="getHistoryOne">
            รายการผู้รับบริการแบบคำขอกู้ยืมเงิน
          </button>
          <button class="btn" @click="getHistoryTwo">
            รายการผู้รับบริการสัญญากู้ยืมเงิน 
          </button>
          <button class="btn" @click="getHistoryOther">
            รายการผู้รับบริการอื่น ๆ
          </button>
        </div>
        <!-- ตารางข้อมูล -->
  
        <v-data-table
          :headers="column"
          :items="history"
          :search="search"
          class="custom-table"
        ></v-data-table>
        <v-btn color="red" @click="exportToCSV">Download</v-btn>
      </main>
    </div>
  </template>
  <script lang="ts" setup>
  import axios, { all } from "axios";
  import { ref, computed } from "vue";
  let history = ref([]);
  let search = ref("");
  const column = ref([
    {
      key: "datetime",
      title: "วันเวลา",
      align: "center",
    },
    {
      key: "type",
      title: "งานบริการ",
      align: "center",
    },
    {
      key: "rate",
      title: "คะแนน",
      align: "center",
    },
  ]);
  get_History();
  
  let allhistory = ref([]);
  
  async function get_History() {
    try {
      const res = await axios.get(
        `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistory`
      );
      if (res.status !== 200) {
        throw Error(res.statusText);
      }
      console.log(res.data);
      history.value = res.data;
      history.value.forEach((value) => {
        value.type = convertType(value.type);
      });
      history.value = history.value.filter((value)=>{
        return value.status === "FINISH"
      })
      // ! backup history
      allhistory.value = history.value;
    } catch (error) {
      console.error(error);
    }
  }
  
  
   function getHistoryOne() {
    history.value = allhistory.value.filter((value)=>{
        return value.type === "แบบคำขอกกู้ยืมเงิน";
    });
  }
   function getHistoryOther() {
    history.value = allhistory.value.filter((value)=>{
        return value.type === "ประเภทอื่น ๆ";
    });
  }
  function convertType(type: string): string {
    switch (type) {
      case "ONE":
        return "แบบคำขอกู้ยืมเงิน";
      case "TWO":
        return "สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม";
      default:
        return "ประเภทอื่น ๆ";
    }
  }
  
  function exportToCSV() {
    const csvContent = convertToCSV(history.value);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  }
  
   function getAllhistory() {
    history.value = allhistory.value;
    console.log(history.value);
  }
  
  async function getHistoryTwo() {
  
    // Update the history array with entries for the current month
    history.value = allhistory.value.filter((value)=>{
        console.log();
        return value.type === "สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม";
    });
    console.log(history.value);
  }
  
  function convertToCSV(rows: any[]) {
    const selectedFields = rows.map(row => ({
      'วันเวลา': row.datetime,
      'งานบริการ': row.type,
      'คะแนน': row.rate,
    }));

    const header = Object.keys(selectedFields[0]).join(",");
    // const content = rows.map((row) => Object.values(row).join(",")).join("\n");
    const content = rows.map(row => {
    return [ row.datetime, `"${row.type}"`,row.rate].join(",");
  }).join("\n");
    return `${header}\n${content}`;
  }
  </script>
  <style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Fira sans", sans-serif;
  }
  
  body {
    background: #f1f5f9;
  }
  
  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }
  
  .app {
    width: 100vw;
    padding: 1rem 15vw 1rem 15vw;
  }
  
  .custom-table {
    box-shadow: 0 4px 8px #4175df; /* Add box shadow */
    border-collapse: collapse;
    height: 29.5rem;
    overflow-y: scroll;
    thead {
      background-color: #f1f5f9;
      th {
        color: #191771;
      }
    }
    th,
    td {
      text-align: center;
    }
    tbody {
      background-color: #f1f5f9;
      td {
        color: #191771;
      }
    }
    tbody :hover {
      background-color: #4175df;
      td {
        color: #f1f5f9;
      }
    }
  }
  
  .search {
    margin-bottom: 0.5rem;
    background-color: #f1f5f9;
    color: #191771;
  }
  
  .table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .abutton {
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-around;
  }
  
  .btn {
    background-color: #191771;
    color: #f1f5f9;
    border-radius: 2rem;
    padding: 10px 50px;
    margin-right: 1rem;
    border: none;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: red;
    color: #f1f5f9;
  }
  
  .last-row {
    background-color: #333;
    color: #fff;
  }
  
  .result-info {
    margin-right: auto;
  }
  
  .pagination {
    margin-left: auto;
  }
  
  .page {
    margin: 0 0.5rem;
    cursor: pointer;
  }
  
  .page:hover {
    text-decoration: underline;
  }
  </style>
  