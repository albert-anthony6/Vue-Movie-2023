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
        <div class="top-container">
            <h1>{{ pageTitle.replace('_', ' ') }}</h1>
            <v-pagination
                v-if="pageCount > 1"
                v-model="currentPage"
                :pages="pageCount"
                :range-size="3"
                class="pagination"
                @update:modelValue="handlePageUpdate"
            />
        </div>
        <div class="options">
            <div v-for="movie in movies" :key="movie.id.toString" class="movie">
                <img v-if="movie.poster_path" :src="`${baseImgUrl}${posterSize}${movie.poster_path}`" :alt="movie.title" />
                <img v-else src="@/assets/images/default_poster.jpg" :alt="movie.title" class="default-img" />
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

    .top-container,
    .options {
        width: 80%;
        margin: 0 auto;
    }

    .top-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        h1 {
            text-transform: capitalize;
        }
    }


    .options {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 30px;

        .movie {
            width: 18%;
            margin-top: 15px;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}
</style>