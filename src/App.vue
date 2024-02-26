<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppHeader />
  <RouterView :key="$route.fullPath" />
  <notifications position="bottom left" class="notifications" />
</template>

<style lang="scss">
@import '@/assets/scss/_theme.scss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
}
</style>
