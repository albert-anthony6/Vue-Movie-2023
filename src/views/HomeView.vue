<script lang="ts" setup>
import useMoviesStore from '@/stores/movies';

const moviesStore = useMoviesStore();
moviesStore.getMovies();
</script>

<template>
  <div class="home">
    <h1>test</h1>
  </div>
</template>

<style lang="scss" scoped>
.home {
}
</style>
