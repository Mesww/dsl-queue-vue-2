<template>
    <div class="flex justify-center w-screen main-wrapper">
        <main class="grid grid-cols-3 align-middle justify-center content-start gap-3 place-items-center md:grid-cols-3 sm:grid-cols-2 ">
            <cards :charttype="Charttype.Bar" :data="chartData"/>
            
        </main>
    </div>
</template>

<script setup lang="ts">
    import cards from '../../components/admin/home.content.vue';
    import { ChartData,Charttype } from '../../models/Chart';
    const chartData: ChartData = {
    labels: ['January', 'February', 'March'],
    datasets: [{ data: [40, 20, 12] }]
    };

</script>

<style lang="scss" scoped>
    .main-wrapper{
    height: calc(100vh - 11.5rem);
    main {
      overflow: scroll;
      padding: 1rem;
      margin: 1rem 0 0rem 0;
      @media (max-width: 640px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
  }

}
</style>