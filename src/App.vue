<script setup lang="ts">
import Footer from './components/global/Footer.vue';
import Header from './components/global/Header.vue';

</script>

<template>
  <Header />
  <main class="main-content">
    <RouterView />
  </main>
  <Footer />
</template>

<style lang="scss">
@use '@/styles/index.scss' as *;

.main-content {
  margin-top: 100px;
  min-height: 100vh;
}
</style>

