<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Carousel, Slide, Navigation, Pagination, } from 'vue3-carousel';
import VideoModal from '@/components/VideoModal.vue';
import 'vue3-carousel/dist/carousel.css'
import useShowsStore from '@/stores/shows';
import type { Show } from '@/utils/show';

const route = useRoute();

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

const showBreakpoints = {
  0: {
    itemsToShow: 2,
    snapAlign: 'center'
  },
  375: {
    itemsToShow: 3,
    snapAlign: 'center'
  },
  586: {
    itemsToShow: 5,
    snapAlign: 'center'
  },
  850: {
    itemsToShow: 6,
    snapAlign: 'center'
  },
  1200: {
    itemsToShow: 9,
    snapAlign: 'center'
  },
}

const showType = ref('movie');
const showTrailer = ref(false);
const trailerKey = ref('');

async function getVideos(id: string) {
  isLoading.value = true;

  await showsStore.getVideos(id)
    .then((resp) => {
        trailerKey.value = resp.key;
        showTrailer.value = true;
        isLoading.value = false;
    })
    .catch((err) => {
        console.error(err);
        showTrailer.value = false;
        isLoading.value = false;
    })
}

const showsStore = useShowsStore();
const shows = ref< {[key: string]: Show[] }>({});
const isLoading = ref(true);

async function getShows(category: string, keyName?: string) {
  if (route.query.type === 'tv') {
    showType.value = 'tv';
  }
  await showsStore.getShows(showType.value, category)
    .then((resp) => {
      shows.value[keyName || category] = resp.results;
      isLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      isLoading.value = false;
    });
}

// Getting all show categories on page load
if (route.query.type === 'tv') {
  getShows('on_the_air', 'nowPlaying');
  getShows('airing_today', 'upcoming');
} else {
  getShows('now_playing', 'nowPlaying');
  getShows('upcoming');
}
getShows('popular');
getShows('top_rated', 'topRated');
</script>

<template>
  <div class="home">
    <div v-if="isLoading" class="loader-container">
      <div class="loadbar" />
    </div>
    <VideoModal 
      v-if="showTrailer"
      :showTrailer="showTrailer" 
      :trailerKey="trailerKey" 
      @toggle-modal="showTrailer = false"
    />
    <div v-if="shows.nowPlaying" class="now-playing">
      <Carousel id="gallery" :items-to-show="1" :transition="1000" :autoplay="5000" :wrap-around="true" v-model="currentSlide">
          <Slide v-for="slide in shows.nowPlaying.length" :key="slide">
            <div class="details">
              <h1 class="title">{{ shows.nowPlaying[slide - 1].title || shows.nowPlaying[slide - 1].name }}</h1>
              <p class="overview">
                {{ shows.nowPlaying[slide - 1].overview.slice(0, 303) }}<span v-if="shows.nowPlaying[slide - 1].overview.length > 303">...</span>
              </p>
              <RouterLink :to="`/show/${shows.nowPlaying[slide - 1].id}/?type=${route.query.type || 'movies'}`">
                <button type="button">Info</button>
              </RouterLink>
              <button
                v-if="route.query.type !== 'tv'" 
                @click="getVideos(shows.nowPlaying[slide - 1].id)" 
                type="button"
              >
                Play Trailer
              </button>
            </div>
            <img
              v-if="shows.nowPlaying[slide - 1].backdrop_path"
              :src="`http://image.tmdb.org/t/p/${backdropSize}${shows.nowPlaying[slide - 1].backdrop_path}`"
              :alt="shows.nowPlaying[slide - 1].title || shows.nowPlaying[slide - 1].name"
              class="main-carousel__item"
            />
            <img
              v-else
              src="@/assets/images/default_backdrop.jpg"
              :alt="shows.nowPlaying[slide - 1].title || shows.nowPlaying[slide - 1].name"
              class="default-img"
            />
          </Slide>
        </Carousel>
        <Carousel
          id="thumbnails"
          :breakpoints="thumbnailBreakpoints"
          :wrap-around="true"
          v-model="currentSlide"
          ref="carousel"
        >
        <Slide v-for="slide in shows.nowPlaying.length" :key="slide">
            <p class="category-tag">Now Playing</p>
            <img
              v-if="shows.nowPlaying[slide - 1].poster_path"
              :src="`http://image.tmdb.org/t/p/${posterSize}${shows.nowPlaying[slide - 1].backdrop_path}`"
              :alt="shows.nowPlaying[slide - 1].title || shows.nowPlaying[slide - 1].name"
              class="sub-carousel__item" @click="slideTo(slide - 1)"
            />
            <img
              v-else
              src="@/assets/images/default_backdrop.jpg"
              :alt="shows.nowPlaying[slide - 1].title || shows.nowPlaying[slide - 1].name"
              class="default-img"
            />
          </Slide>
      </Carousel>
    </div>

    <!-- Upcoming Shows -->
    <div v-if="shows.upcoming" class="upcoming">
      <Carousel
        class="posters"
        :itemsToShow="8.95" 
        :autoplay="5000" 
        :wrapAround="true" 
        :transition="500"
        :breakpoints="showBreakpoints"
      >
        <Slide v-for="slide in 10" :key="slide">
          <RouterLink :to="`/show/${shows.upcoming[slide].id}/?type=${route.query.type || 'movies'}`">
            <img
              v-if="shows.upcoming[slide - 1].poster_path"
              :src="`${baseImgUrl}${posterSize}${shows.upcoming[slide].poster_path}`"
              :alt="shows.upcoming[slide - 1].title || shows.upcoming[slide - 1].name"
              class="carousel__item"
            />
            <img
              v-else
              src="@/assets/images/default_poster.jpg"
              :alt="shows.upcoming[slide - 1].title || shows.upcoming[slide - 1].name"
              class="default-img"
            />
          </RouterLink>
          <p class="category-tag">Upcoming</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            :to="`/category/upcoming/?type=${route.query.type || 'movies'}`"
            class="view-all">View All <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" />
          </RouterLink>
        </template>
      </Carousel>
    </div>

    <!-- Popular Shows -->
    <div v-if="shows.popular" class="popular">
      <Carousel 
        class="posters" 
        :itemsToShow="8.95"
        :autoplay="5000"
        :wrapAround="true"
        :transition="500"
        dir="rtl"
        :breakpoints="showBreakpoints"
      >
        <Slide v-for="slide in 10" :key="slide">
          <RouterLink :to="`/show/${shows.popular[slide].id}/?type=${route.query.type || 'movies'}`">
            <img
              v-if="shows.popular[slide - 1].poster_path"
              :src="`${baseImgUrl}${posterSize}${shows.popular[slide].poster_path}`"
              :alt="shows.popular[slide - 1].title || shows.popular[slide - 1].name"
              class="carousel__item"
            />
            <img
              v-else
              src="@/assets/images/default_poster.jpg"
              :alt="shows.popular[slide - 1].title || shows.popular[slide - 1].name"
              class="default-img"
            />
          </RouterLink>
          <p class="category-tag">Popular</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            :to="`/category/popular/?type=${route.query.type || 'movies'}`"
            class="view-all"
          >
            <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" /> View All
          </RouterLink>
        </template>
      </Carousel>
    </div>

    <!-- Top Rated Shows -->
    <div v-if="shows.topRated" class="top-rated">
      <Carousel 
        class="posters"
        :itemsToShow="8.95"
        :autoplay="5000"
        :wrapAround="true"
        :transition="500"
        :breakpoints="showBreakpoints"
      >
        <Slide v-for="slide in 10" :key="slide">
          <RouterLink :to="`/show/${shows.topRated[slide].id}/?type=${route.query.type || 'movies'}`">
            <img
              v-if="shows.topRated[slide - 1].poster_path"
              :src="`${baseImgUrl}${posterSize}${shows.topRated[slide].poster_path}`"
              :alt="shows.topRated[slide - 1].title || shows.topRated[slide - 1].name"
              class="carousel__item"
            />
            <img
              v-else
              src="@/assets/images/default_poster.jpg"
              :alt="shows.topRated[slide - 1].title || shows.topRated[slide - 1].name"
              class="default-img"
            />
          </RouterLink>
          <p class="category-tag">Top Rated</p>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
          <RouterLink
            :to="`/category/top_rated/?type=${route.query.type || 'movies'}/?type=${route.query.type || 'movies'}`"
            class="view-all"
          >
            View All <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" />
          </RouterLink>
        </template>
      </Carousel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  position: relative;
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
      width: 100vw;

      .default-img {
          height: 100vh;
          object-fit: cover;
      }

      .details {
        position: absolute;
        font-size: rem(7);
        top: 60%;
        left: 5%;
        width: fit-content;
        max-width: 80%;
        padding: 15px;
        border-radius: 8px;
        transform: translateY(-60%);
        text-align: left;
        text-shadow: rgba($darkest-neutral, 0.7) 1px 0 5px;
        background-color: rgba($darkest-neutral, 0.3);
        
        @include bp-sm-phone-landscape {
          font-size: rem(8);
        }
        
        @include bp-lg-laptop {
          font-size: rem(10);
          max-width: 50%;
        }

        h1 {
          width: 100%;
          font-size: em(40, 10);
          line-height: 1;
          margin-bottom: 10px;
          
          @include bp-sm-phone-landscape {
            line-height: 38.4px;
            margin-bottom: 5px;
          }
        }

        .overview {
          display: none;
          font-size: em(20, 10);
          margin-bottom: 10px;

          @include bp-sm-phone-landscape{
            display: block;
          }
        }

        button {
          font-size: em(22, 10);
          box-shadow: 0 0 10px rgba($darkest-neutral, 0.5);
          padding: 5px 10px;
          border-radius: 3px;
          
          @include bp-sm-phone-landscape {
            padding: 10px 20px;
            border-radius: 8px;
          }

          &:not(:first-child) {
            margin-left: 10px;

            @include bp-sm-phone-landscape {
              margin-left: 15px;
            }
          }
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
        width: 100%;
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