<template>
  <div class="bg">
    <navbar/>
      <div class="flex justify-center w-screen main-wrapper">
        <main class="grid grid-cols-3 align-middle justify-center content-start gap-3 place-items-center md:grid-cols-3 sm:grid-cols-2 ">
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
              <div class="bg-white w-64 h-40">
              </div>
          </main>
      </div>
  </div>
</template>

<script setup lang="ts">
    import navbar from '../../components/admin/navbar.vue';
</script>

<style lang="scss" scoped>
.bg{
  background-color: #191770;
}

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
