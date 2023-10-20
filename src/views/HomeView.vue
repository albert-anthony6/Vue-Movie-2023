<script lang="ts" setup>
import { ref } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css'
import useMoviesStore from '@/stores/movies';
import type PopularMovie from '@/utils/popular-movie';

const popularMovies = ref<PopularMovie[]>([]);

const baseImgUrl = import.meta.env.VITE_BASE_IMG_URL;
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

moviesStore.getMovies()
  .then((resp) => {
    popularMovies.value = resp;
  })
  .catch((err) => {
    console.error(err);
  })
</script>

<template>
  <div class="home">
    <div class="banner">
      <Carousel id="gallery" :items-to-show="1" :autoplay="5000" :wrap-around="true" v-model="currentSlide">
          <Slide v-for="slide in popularMovies.length" :key="slide">
            <div class="details">
              <h1 class="title">{{ popularMovies[slide - 1].title }}</h1>
              <p class="overview">
                {{ popularMovies[slide - 1].overview.slice(0, 303) }}<span v-if="popularMovies[slide - 1].overview.length > 303">...</span>
              </p>
              <button type="button">Info</button>
            </div>
            <img :src="baseImgUrl + backdropSize + popularMovies[slide - 1].backdrop_path" class="main-carousel__item" />
          </Slide>
      </Carousel>
      <Carousel
          id="thumbnails"
          :breakpoints="thumbnailBreakpoints"
          :wrap-around="true"
          v-model="currentSlide"
          ref="carousel"
      >
          <Slide v-for="slide in popularMovies.length" :key="slide">
            <img :src="baseImgUrl + posterSize + popularMovies[slide - 1].backdrop_path" class="sub-carousel__item" @click="slideTo(slide - 1)" />
          </Slide>
      </Carousel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  margin-top: 80px;

  @include bp-sm-phone-landscape {
    margin-top: 50px;
  }

  .banner {
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
}
</style>
