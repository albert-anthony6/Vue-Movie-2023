<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useMoviesStore from '@/stores/movies';
import type { MovieDetails } from '@/utils/movie';

const route = useRoute();

const baseImgUrl = 'http://image.tmdb.org/t/p/';
const posterSize = 'w500';
const backdropSize = 'w1280';

function NumToTime(num: string) { 
  var hours = Math.floor(parseInt(num, 10) / 60);  
  var minutes = parseInt(num, 10) % 60;
  if (minutes + ''.length < 2) {
    minutes = 0 + minutes; 
  }
  return `${hours}h ${minutes}m`;
}

const movie = ref<MovieDetails>({} as MovieDetails);
const moviesStore = useMoviesStore();
const isLoading = ref(true);

moviesStore.getMovie(route.params.id as string)
    .then((resp) => {
        console.log(resp);
        movie.value = resp;
        isLoading.value = false;
    })
    .catch((err) => {
        console.error(err);
        isLoading.value = false;
    })
</script>

<template>
    <div class="show-view">
            <div v-if="isLoading" class="loader-container">
                <div class="loadbar" />
            </div>
            <template v-else>
                <template v-if="movie.actors?.cast.length">
                    <div class="banner">
                        <img class="backdrop" :src="`${baseImgUrl}${backdropSize}${movie.movieDetails.backdrop_path}`" :alt="movie.movieDetails.title" />
                        <div class="details">
                            <h1 class="title">{{ movie.movieDetails.title }}</h1>
                            <span class="year">{{ movie.movieDetails.release_date.split('-')[0] }}</span>
                            <span class="runtime">{{ NumToTime(movie.movieDetails.runtime.toString()) }}</span>
                            <span v-for="genre in movie.movieDetails.genres" :key="genre.id" class="genre">
                                {{ genre.name }}
                            </span>
                            <p class="overview">
                                {{ movie.movieDetails.overview }}
                            </p>
                            <div class="tags">
                                <div v-if="movie.movieDetails.budget !== 0 && movie.movieDetails.revenue !== 0" class="tag-group-1">
                                    <p class="tag">Budget: ${{ new Intl.NumberFormat().format(movie.movieDetails.budget as number) }}</p>
                                    <p class="tag">Revenue: ${{ new Intl.NumberFormat().format(movie.movieDetails.revenue as number) }}</p>
                                </div>
                                <div class="tag-group-2">
                                    <p class="tag">Status: {{ movie.movieDetails.status }}</p>
                                    <p class="tag">Original Language: {{ movie.movieDetails.original_language.toUpperCase() }}</p>
                                </div>
                            </div>
                            <p class="score">{{ Math.round((movie.movieDetails.vote_average as number + Number.EPSILON) * 100) / 100 }}</p>
                        </div>
                    </div>
                    <div class="cast">
                        <h2>Meet the Cast</h2>
                        <div class="actors">
                            <div v-for="actor in movie.actors.cast" :key="actor.id" class="actor-card">
                                <img v-if="actor.profile_path" :src="baseImgUrl + posterSize + actor.profile_path" :alt="actor.name" />
                                <img v-else src="@/assets/images/default_poster.jpg" :alt="actor.name" />
                                <p v-if="actor.name">{{ actor.name }}</p>
                                <p v-if="actor.character">Plays {{ actor.character }}</p>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else class="no-info">
                    <div class="content">
                        <p>Sorry!</p>
                        <h2>No Info Available for:</h2>
                        <h2>"{{ movie.movieDetails?.title }}"</h2>
                    </div>
                </div>
            </template>
        </div>
</template>

<style lang="scss" scoped>
.show-view {
    padding: 70px 0 50px;
    background-image: url('@/assets/images/test.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;

    .banner {
        position: relative;
        width: 100vw;
        height: 40vw;
        
        .details {
            position: absolute;
            font-size: rem(8);
            top: 60%;
            left: 5%;
            max-width: 100%;
            padding: 15px;
            border-radius: 8px;
            transform: translateY(-60%);
            text-align: left;
            background-color: rgba($darkest-neutral, 0.3);
            text-shadow: rgba($darkest-neutral, 0.7) 1px 0 5px;
            z-index: 2;
            
            @include bp-custom-min(850) {
                font-size: rem(10);
                max-width: 40%;
                min-width: 500px;
            }

            h1 {
                font-size: em(40, 10);
                margin-bottom: 10px;
            }

            span {
                font-size: rem(15);
                padding-right: 10px;

                &:not(:first-of-type) {
                    border-left: 1px solid $lightest-neutral;
                    padding-left: 10px;
                }
            }

            .overview {
                font-size: em(20, 10);
                margin: 5px 0;
            }

            .tags {
                display: flex;
                align-items: center;
                margin: 10px 0;;

                .tag-group-1 {
                    margin-right: 15px;
                }

            }

            .score {
                font-size: rem(18);
                background-color: orange;
                padding: 5px 10px;
                display: inline-block;
                border-radius: 8px;
                text-shadow: $darkest-neutral 1px 0 5px;
            }

            button {
                font-size: em(22, 10);
                box-shadow: 0 0 10px rgba($darkest-neutral, 0.5);
            }
        }
        
        .backdrop {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .cast {
        margin-top: 50px;

        h2 {
            width: 80%;
            font-family: $secondary-font-stack;
            text-align: left;
            margin: 0 auto 15px;
        }

        .actors {
            width: 85%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            
            .actor-card {
                flex: 0 0 calc(18% - 1em);
                margin: 1em 0 0 20px;
                
                &:not(:nth-child(5n+5)) {
                    margin-right: 1.333333em;
                }
                
                img {
                    width: 100%;
                    border-radius: 50px;
                }
            }
        }
    }
}

.no-info {
    position: relative;
    padding: 70px 0 50px;
    background-image: url('@/assets/images/test.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    
    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        p {
            font-family: $secondary-font-stack;
            font-size: rem(80);
            transform: skew(-10deg, -10deg);
        }
    }
}
</style>