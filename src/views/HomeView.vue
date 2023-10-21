<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Carousel, Slide, Navigation, Pagination, } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css'
import useMoviesStore from '@/stores/movies';
import type Movie from '@/utils/movie';

const baseImgUrl = 'http://image.tmdb.org/t/p/';
const posterSize = 'w500';
const backdropSize = 'w1280';

const currentSlide = ref(0);

function slideTo(val: number) {
  currentSlide.value = val
}

const thumbnailBreakpoints = {
  0: {
    itemsToShow: 2,
    snapAlign: 'start'
  },
  400: {
    itemsToShow: 3,
    snapAlign: 'start'
  },
  576: {
    itemsToShow: 4,
    snapAlign: 'start'
  },
  992: {
    itemsToShow: 5,
    snapAlign: 'start'
  },
}

const moviesStore = useMoviesStore();
const movies = ref< {[key: string]: Movie[] }>({});

async function getMovies(category: string, keyName?: string) {
  await moviesStore.getMovies(category)
    .then((resp) => {
      movies.value[keyName || category] = resp.results;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Getting all movie categories
getMovies('now_playing', 'nowPlaying');
getMovies('upcoming');
getMovies('popular');
getMovies('top_rated', 'topRated');
</script>

<template>
  <div class="home">
    <div v-if="movies.nowPlaying" class="now-playing">
      <Carousel id="gallery" :items-to-show="1" :autoplay="5000" :wrap-around="true" v-model="currentSlide">
          <Slide v-for="slide in movies.nowPlaying.length" :key="slide">
            <div class="details">
              <h1 class="title">{{ movies.nowPlaying[slide - 1].title }}</h1>
              <p class="overview">
                {{ movies.nowPlaying[slide - 1].overview.slice(0, 303) }}<span v-if="movies.nowPlaying[slide - 1].overview.length > 303">...</span>
              </p>
              <button type="button">Info</button>
            </div>
            <img :src="`http://image.tmdb.org/t/p/${backdropSize}${movies.nowPlaying[slide - 1].backdrop_path}`" class="main-carousel__item" />
          </Slide>
        </Carousel>
        <Carousel
        id="thumbnails"
        :breakpoints="thumbnailBreakpoints"
        :wrap-around="true"
        v-model="currentSlide"
        ref="carousel"
        >
        <Slide v-for="slide in movies.nowPlaying.length" :key="slide">
            <p class="category-tag">Now Playing</p>
            <img :src="`http://image.tmdb.org/t/p/${posterSize}${movies.nowPlaying[slide - 1].backdrop_path}`" class="sub-carousel__item" @click="slideTo(slide - 1)" />
          </Slide>
      </Carousel>
    </div>
    <div v-if="movies.upcoming" class="upcoming">
      <Carousel class="posters" :itemsToShow="8.95" :autoplay="5000" :wrapAround="true" :transition="500">
        <Slide v-for="slide in 10" :key="slide">
          <img :src="`${baseImgUrl}${posterSize}${movies.upcoming[slide].poster_path}`" class="carousel__item" />
          <p class="category-tag">Upcoming</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            to="/category/upcoming"
            class="view-all">View All <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" />
          </RouterLink>
        </template>
      </Carousel>
    </div>
    <div v-if="movies.popular" class="popular">
      <Carousel class="posters" :itemsToShow="8.95" :autoplay="5000" :wrapAround="true" :transition="500" dir="rtl">
        <Slide v-for="slide in 10" :key="slide">
          <img :src="`${baseImgUrl}${posterSize}${movies.popular[slide].poster_path}`" class="carousel__item" />
          <p class="category-tag">Popular</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            to="/category/popular"
            class="view-all"><font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" /> View All
          </RouterLink>
        </template>
      </Carousel>
    </div>
    <div v-if="movies.topRated" class="top-rated">
      <Carousel class="posters" :itemsToShow="8.95" :autoplay="5000" :wrapAround="true" :transition="500">
        <Slide v-for="slide in 10" :key="slide">
          <img :src="`${baseImgUrl}${posterSize}${movies.topRated[slide].poster_path}`" class="carousel__item" />
          <p class="category-tag">Top Rated</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            to="/category/top_rated"
            class="view-all">View All <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" />
          </RouterLink>
        </template>
      </Carousel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  margin-top: 80px;
  padding-bottom: 50px;

  @include bp-sm-phone-landscape {
    margin-top: 50px;
  }

  .category-tag {
    position: absolute;
    bottom: 0;
    left: -1.5px;
    padding: 0 5px;
    background-color: red;
  }

  .now-playing {
    #gallery {
      position: relative;

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
        text-shadow: rgba($darkest-neutral, 0.7) 1px 0 5px;
        
        @include bp-custom-min(850) {
          font-size: rem(10);
          max-width: 40%;
          min-width: 500px;
        }

        h1 {
          font-size: em(40, 10);
        }

        .overview {
          font-size: em(20, 10);
          margin-bottom: 10px;
        }

        button {
          font-size: em(22, 10);
          box-shadow: 0 0 10px rgba($darkest-neutral, 0.5);
        }
      }

      img {
        width: 100vw;
      }
    }

    #thumbnails {
      img {
        width: 50vw;
        cursor: pointer;
        
        @include bp-custom-min(400) {
          width: 33.3vw;
        }
        
        @include bp-sm-phone-landscape {
          width: 25vw;
        }

        @include bp-lg-laptop {
          width: 20vw;
        }
      }
    }
  }

  .upcoming,
  .popular,
  .top-rated {
    margin-top: 50px;

    .view-all {
      font-size: rem(20);
      font-weight: bold;
      position: absolute;
      top: 0;
      right: 25px;
      cursor: pointer;
      text-transform: uppercase;
      
      &:hover {
        svg {
          transition: all 0.2s ease;
          transform: translateX(5px);
        }
      }
    }
  }

  .posters {
    position: relative;

    img {
        width: 11.17vw;
        border-radius: 20px;
        cursor: pointer;
      }

    .category-tag {
      bottom: 5px;
    }

    .carousel__slide {
      padding: 5px;
    }

    .carousel__viewport {
      perspective: 2000px;
    }

    .carousel__track {
      transform-style: preserve-3d;
    }

    .carousel__slide--sliding {
      transition: 0.5s;
    }

    .carousel__slide {
      opacity: 0.9;
      transform: rotateY(-20deg) scale(0.8);
    }

    .carousel__slide--active ~ .carousel__slide {
      transform: rotateY(20deg) scale(0.8);
    }

    .carousel__slide--prev {
      opacity: 1;
      transform: rotateY(-10deg) scale(0.85);
    }

    .carousel__slide--next {
      opacity: 1;
      transform: rotateY(10deg) scale(0.85);
    }

    .carousel__slide--active {
      opacity: 1;
      transform: rotateY(0);
    }
  }
}
</style>
