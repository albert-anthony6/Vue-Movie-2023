<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import vPagination from '@hennge/vue3-pagination';
import '@hennge/vue3-pagination/dist/vue3-pagination.css';
import useMoviesStore from '@/stores/movies';
import type Movies from '@/utils/movie';

const route = useRoute();

const baseImgUrl = 'http://image.tmdb.org/t/p/';
const posterSize = 'w500';
const pageTitle = route.params.categoryName as string;

function getMovies(page: string) {
    moviesStore.getMovies(route.params.categoryName as string, page)
        .then((resp) => {
            // API states page requests must be 500 or less
            pageCount.value = resp.total_pages > 500 ? 500 : resp.total_pages;
            movies.value = resp.results;
        })
        .catch((err) => {
            console.error(err);
        })
}

const movies = ref<Movies[]>([]);
const pageCount = ref(0);
const currentPage = ref(1);

function handlePageUpdate(val: any) {
    currentPage.value = val;
    getMovies(val);
}

const moviesStore = useMoviesStore();
getMovies('1');
</script>

<template>
    <div class="category-view">
        <h1>{{ pageTitle.replace('_', ' ') }}</h1>
        <div class="options">
            <div v-for="movie in movies" :key="movie.id.toString" class="movie">
                <img :src="`${baseImgUrl}${posterSize}${movie.poster_path}`" :alt="movie.title" />
            </div>
        </div>
        <v-pagination
            v-if="pageCount > 1"
            v-model="currentPage"
            :pages="pageCount"
            :range-size="3"
            class="pagination"
            @update:modelValue="handlePageUpdate"
        />
    </div>
</template>

<style lang="scss" scoped>
.category-view {
    padding: 150px 0 50px;

    h1,
    .options {
        width: 80%;
        margin: 0 auto;
    }

    h1 {
        text-align: left;
        text-transform: capitalize;
        margin-bottom: 10px;
    }

    .options {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 30px;

        .movie {
            width: 18%;
            cursor: pointer;

            img {
                width: 100%;
            }
        }
    }
}
</style>