<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import VideoModal from '@/components/VideoModal.vue'
import useShowsStore from '@/stores/shows'
import type { ShowDetails } from '@/utils/show'
import { useNotification } from '@kyvg/vue3-notification'

const { notify } = useNotification()

const route = useRoute()

const baseImgUrl = 'http://image.tmdb.org/t/p/'
const posterSize = 'w500'
const backdropSize = 'w1280'

function NumToTime(num: string) {
  var hours = Math.floor(parseInt(num, 10) / 60)
  var minutes = parseInt(num, 10) % 60
  if (minutes + ''.length < 2) {
    minutes = 0 + minutes
  }
  return `${hours}h ${minutes}m`
}

const trailerKey = ref('')
const showTrailer = ref(false)
const isLoading = ref(true)

async function getVideos(id: string) {
  isLoading.value = true
  await showsStore
    .getVideos(id)
    .then((resp) => {
      if (resp) {
        trailerKey.value = resp.key
        showTrailer.value = true
      } else {
        notify({
          title: 'No Trailer Found',
          text: 'No Available Trailer to Show.',
          type: 'error'
        })
      }
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      notify({
        title: 'No Data Found',
        text: 'Trailer Data Not Found.',
        type: 'error'
      })
      showTrailer.value = false
      isLoading.value = false
    })
}

const show = ref<ShowDetails>({} as ShowDetails)
const showType = ref('movie')
const showsStore = useShowsStore()

async function getShow() {
  if (route.query.type === 'tv') {
    showType.value = 'tv'
  }
  await showsStore
    .getShow(showType.value, route.params.id as string)
    .then((resp) => {
      show.value = resp
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      notify({
        title: 'No Data Found',
        text: 'Show Data Not Found.',
        type: 'error'
      })
      isLoading.value = false
    })
}

getShow()
</script>

<template>
  <div class="show-view page-bg">
    <div v-if="isLoading" class="loader-container">
      <div class="loader">
        <div class="loader__filmstrip" />
        <p class="loader__text">loading</p>
      </div>
    </div>
    <template v-if="show.actors?.cast.length">
      <VideoModal
        v-if="showTrailer"
        :showTrailer="showTrailer"
        :trailerKey="trailerKey"
        @toggle-modal="showTrailer = false"
      />
      <div class="banner">
        <img
          v-if="show.showDetails.backdrop_path"
          class="backdrop"
          :src="`${baseImgUrl}${backdropSize}${show.showDetails.backdrop_path}`"
          :alt="show.showDetails.title || show.showDetails.name"
        />
        <img
          v-else
          src="@/assets/images/default_backdrop.jpg"
          :alt="show.showDetails.title || show.showDetails.name"
          class="backdrop"
        />
        <div class="details">
          <h1 class="title">{{ show.showDetails.title || show.showDetails.name }}</h1>
          <span v-if="show.showDetails.release_date" class="year">{{
            show.showDetails.release_date.split('-')[0]
          }}</span>
          <span v-if="show.showDetails.runtime" class="runtime">{{
            NumToTime(show.showDetails.runtime.toString())
          }}</span>
          <span v-for="genre in show.showDetails.genres" :key="genre.id" class="genre">
            {{ genre.name }}
          </span>
          <p v-if="show.showDetails.overview" class="overview">
            {{ show.showDetails.overview }}
          </p>
          <div class="tags">
            <div v-if="show.showDetails.budget && show.showDetails.revenue" class="tag-group-1">
              <p class="tag">
                Budget: ${{ new Intl.NumberFormat().format(show.showDetails.budget as number) }}
              </p>
              <p class="tag">
                Revenue: ${{ new Intl.NumberFormat().format(show.showDetails.revenue as number) }}
              </p>
            </div>
            <div
              v-if="show.showDetails.status && show.showDetails.original_language"
              class="tag-group-2"
            >
              <p class="tag">Status: {{ show.showDetails.status }}</p>
              <p class="tag">
                Original Language: {{ show.showDetails.original_language.toUpperCase() }}
              </p>
            </div>
          </div>
          <p v-if="show.showDetails.vote_average" class="score">
            {{
              Math.round(((show.showDetails.vote_average as number) + Number.EPSILON) * 100) / 100
            }}
          </p>
          <button
            v-if="route.query.type !== 'tv'"
            @click="getVideos(show.showDetails.id)"
            type="button"
            class="play-trailer"
          >
            Play Trailer
          </button>
        </div>
      </div>
      <div class="mobile-details">
        <h1 class="title">{{ show.showDetails.title || show.showDetails.name }}</h1>
        <span v-if="show.showDetails.release_date" class="year">{{
          show.showDetails.release_date.split('-')[0]
        }}</span>
        <span v-if="show.showDetails.runtime" class="runtime">{{
          NumToTime(show.showDetails.runtime.toString())
        }}</span>
        <span v-for="genre in show.showDetails.genres" :key="genre.id" class="genre">
          {{ genre.name }}
        </span>
        <p v-if="show.showDetails.overview" class="overview">
          {{ show.showDetails.overview }}
        </p>
        <div class="tags">
          <div v-if="show.showDetails.budget && show.showDetails.revenue" class="tag-group-1">
            <p class="tag">
              Budget: ${{ new Intl.NumberFormat().format(show.showDetails.budget as number) }}
            </p>
            <p class="tag">
              Revenue: ${{ new Intl.NumberFormat().format(show.showDetails.revenue as number) }}
            </p>
          </div>
          <div
            v-if="show.showDetails.status && show.showDetails.original_language"
            class="tag-group-2"
          >
            <p class="tag">Status: {{ show.showDetails.status }}</p>
            <p class="tag">
              Original Language: {{ show.showDetails.original_language.toUpperCase() }}
            </p>
          </div>
        </div>
        <p v-if="show.showDetails.vote_average" class="score">
          {{ Math.round(((show.showDetails.vote_average as number) + Number.EPSILON) * 100) / 100 }}
        </p>
        <button
          v-if="route.query.type !== 'tv'"
          @click="getVideos(show.showDetails.id)"
          type="button"
          class="play-trailer"
        >
          Play Trailer
        </button>
      </div>
      <div class="cast">
        <h2>Meet the Cast</h2>
        <div class="actors">
          <div v-for="actor in show.actors.cast" :key="actor.id" class="actor-card">
            <img
              v-if="actor.profile_path"
              :src="baseImgUrl + posterSize + actor.profile_path"
              :alt="actor.name"
            />
            <img v-else src="@/assets/images/default_poster.jpg" :alt="actor.name" />
            <p v-if="actor.name">{{ actor.name }}</p>
            <p v-if="actor.character">Plays {{ actor.character }}</p>
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="show.actors?.cast && !show.actors?.cast.length" class="no-info">
      <div class="content">
        <p>Sorry!</p>
        <template v-if="show.showDetails?.title || show.showDetails?.name">
          <h2>No Info Available for:</h2>
          <h2>"{{ show.showDetails.title || show.showDetails?.name }}"</h2>
        </template>
        <h2 v-else>No Info Available for this show.</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show-view {
  padding: 70px 0 50px;
  min-height: 100vh;

  .banner {
    position: relative;
    width: 100vw;
    height: 40vw;

    .backdrop {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  .details,
  .mobile-details {
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
      max-width: 45%;
    }

    h1 {
      width: 100%;
      font-size: em(40, 10);
      line-height: 1;
      margin-bottom: 10px;

      @include bp-custom-min(1250) {
        width: auto;
        line-height: 38.4px;
        margin-bottom: 5px;
      }
    }

    span {
      font-size: rem(15);
      padding-right: 10px;

      &:not(:first-of-type) {
        padding-left: 10px;

        @include bp-custom-min(650) {
          border-left: 1px solid $lightest-neutral;
        }
      }
    }

    .overview {
      font-size: em(20, 10);
      margin: 5px 0;
    }

    .tags {
      display: flex;
      align-items: center;
      margin: 10px 0;

      .tag-group-1 {
        margin-right: 15px;
      }
    }

    .score {
      font-size: rem(18);
      display: inline-block;
      padding: 5px 10px;
      margin-right: 15px;
      background-color: orange;
      border-radius: 8px;
      text-shadow: $darkest-neutral 1px 0 5px;
    }

    .play-trailer {
      font-size: rem(18);
      padding: 8px 13px;
      transform: translateY(-1px);
    }

    button {
      font-size: em(22, 10);
      box-shadow: 0 0 10px rgba($darkest-neutral, 0.5);
    }
  }

  .details {
    display: none;

    @include bp-custom-min(650) {
      display: block;
    }

    .overview {
      display: none;

      @include bp-custom-min(1250) {
        display: block;
      }
    }
  }

  .mobile-details {
    display: block;
    position: static;
    width: 80%;
    max-width: 100%;
    margin: 0 auto;
    padding: 15px 0;
    border-radius: 0;
    transform: translateY(0);
    background-color: transparent;
    text-align: center;

    @include bp-sm-phone-landscape {
      text-align: left;
    }

    @include bp-custom-min(1250) {
      display: none;
    }

    *:not(.overview) {
      display: inline-block;

      @include bp-custom-min(650) {
        display: none;
      }
    }

    span:not(:first-of-type) {
      &::before {
        content: '•';
        position: relative;
        left: -10px;
      }
    }

    .tags {
      display: flex;
      flex-direction: column;
      text-align: center;

      @include bp-custom-min(530) {
        flex-direction: row;
      }

      @include bp-sm-phone-landscape {
        text-align: left;
      }

      .tag-group-1,
      .tag-group-2 {
        margin-right: 0;

        @include bp-custom-min(530) {
          width: 45%;
          margin-right: 15px;
        }

        .tag {
          display: block;
          white-space: nowrap;

          @include bp-custom-min(530) {
            display: inline-block;
          }
        }
      }

      .tag-group-1 {
        margin-bottom: 5px;

        @include bp-custom-min(530) {
          margin-bottom: 0;
        }
      }
    }
  }

  .cast {
    margin-top: 25px;

    @include bp-custom-min(1250) {
      margin-top: 50px;
    }

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
      align-items: stretch;
      margin: 0 auto;

      .actor-card {
        flex: 0 0 calc(100% - 1em);
        margin: 1em 0 0 20px;

        @include bp-custom-min(400) {
          flex: 0 0 calc(42% - 1em);
        }

        @include bp-custom-min(630) {
          flex: 0 0 calc(28% - 1em);
        }

        @include bp-lg-laptop {
          flex: 0 0 calc(21.5% - 1em);
        }

        @include bp-xl-desktop {
          flex: 0 0 calc(17% - 1em);
        }

        &:not(:nth-child(5n + 5)) {
          margin-right: 1.333333em;
        }

        img {
          width: 100%;
          border-radius: 25px;

          @include bp-sm-phone-landscape {
            border-radius: 50px;
          }
        }
      }
    }
  }
}

.no-info {
  position: relative;
  padding: 70px 0 50px;
  height: 100vh;

  .content {
    position: absolute;
    width: 100%;
    padding: 0 25px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    p {
      font-family: $secondary-font-stack;
      font-size: rem(80);
      transform: skew(-10deg, -10deg);
    }

    h2 {
      font-size: rem(35);

      @include bp-xs-phone {
        font-size: rem(42);
      }

      @include bp-sm-phone-landscape {
        font-size: rem(52);
      }
    }
  }
}
</style>
