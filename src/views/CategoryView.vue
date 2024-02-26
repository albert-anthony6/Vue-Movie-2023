<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useMq } from 'vue3-mq'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import vPagination from '@hennge/vue3-pagination'
import { useNotification } from '@kyvg/vue3-notification'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import useShowsStore from '@/stores/shows'
import type { Show } from '@/utils/show'

const { notify } = useNotification()

const route = useRoute()
const router = useRouter()

const mq = useMq()

const showsStore = useShowsStore()

const baseImgUrl = 'http://image.tmdb.org/t/p/'
const posterSize = 'w500'
const pageTitle = (route.params.categoryName as string) || 'Search Result:'
const isLoading = ref(true)

async function getSearchResults(page: string) {
  showsStore
    .getSearch(showsStore.searchInfo.dropdownValue, showsStore.searchInfo.searchValue, page)
    .then((resp) => {
      // API states page requests must be 500 or less
      pageCount.value = resp.total_pages > 500 ? 500 : resp.total_pages
      shows.value = resp.results
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      notify({
        title: 'No Data Found',
        text: 'Data Not Found.',
        type: 'error'
      })
      isLoading.value = false
    })
}

async function getShows(page: string) {
  let showType = 'movie'
  if (route.query.type === 'tv') {
    showType = 'tv'
  }
  await showsStore
    .getShows(showType, route.params.categoryName as string, page)
    .then((resp) => {
      // API states page requests must be 500 or less
      pageCount.value = resp.total_pages > 500 ? 500 : resp.total_pages
      shows.value = resp.results
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err)
      notify({
        title: 'No Data Found',
        text: 'Data Not Found.',
        type: 'error'
      })
      isLoading.value = false
    })
}

const shows = ref<Show[]>([])
const pageCount = ref(0)
const currentPage = ref(1)

const rangeSize = computed(() => {
  let size = 3

  if (mq.smMinus) {
    size = 0
  } else if (mq.mdMinus) {
    size = 2
  }
  return size
})

function handlePageUpdate(val: any) {
  currentPage.value = val
  if (route.name === 'search') {
    getSearchResults(val)
  } else {
    getShows(val)
  }
}

if (route.name === 'search') {
  // Return to main page if there is no search value
  if (!showsStore.searchInfo.searchValue) {
    router.push('/')
  }

  getSearchResults('1')
} else {
  getShows('1')
}
</script>

<template>
  <div class="category-view page-bg">
    <div v-if="isLoading" class="loader-container">
      <div class="loader">
        <div class="loader__filmstrip"></div>
        <p class="loader__text">loading</p>
      </div>
    </div>
    <template v-else>
      <div class="top-container">
        <h1>{{ pageTitle.replace('_', ' ') }}</h1>
        <h2 v-if="!shows.length" class="empty-state">No Shows Found</h2>
        <v-pagination
          v-if="pageCount > 1"
          v-model="currentPage"
          :pages="pageCount"
          :range-size="rangeSize"
          class="pagination"
          @update:modelValue="handlePageUpdate"
        />
      </div>
      <div class="options">
        <div v-for="show in shows" :key="show.id" class="show">
          <RouterLink :to="`/show/${show.id}/?type=${route.query.type || 'movies'}`">
            <img
              v-if="show.poster_path"
              :src="`${baseImgUrl}${posterSize}${show.poster_path}`"
              :alt="show.title || show.name"
            />
            <img
              v-else
              src="@/assets/images/default_poster.jpg"
              :alt="show.title || show.name"
              class="default-img"
            />
          </RouterLink>
        </div>
      </div>
      <v-pagination
        v-if="pageCount > 1"
        v-model="currentPage"
        :pages="pageCount"
        :range-size="rangeSize"
        class="pagination"
        @update:modelValue="handlePageUpdate"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.category-view {
  padding: 150px 0 50px;
  min-height: 100vh;

  .top-container,
  .options {
    width: 80%;
    margin: 0 auto;
  }

  .top-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;

    @include bp-lg-laptop {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    h1 {
      text-transform: capitalize;
      margin-bottom: 15px;

      @include bp-lg-laptop {
        margin-bottom: 0;
      }
    }

    h2 {
      position: absolute;
      width: 100%;
      font-size: rem(32);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      @include bp-sm-phone-landscape {
        font-size: rem(52);
      }
    }
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 30px;

    .show {
      margin-top: 15px;
      flex: 0 0 calc(100% - 1em);
      cursor: pointer;
      margin: 1em 0 0 20px;

      @include bp-custom-min(400) {
        flex: 0 0 calc(48.5% - 1em);
      }

      @include bp-custom-min(630) {
        flex: 0 0 calc(32.5% - 1em);
      }

      @include bp-lg-laptop {
        flex: 0 0 calc(24% - 1em);
      }

      @include bp-xl-desktop {
        flex: 0 0 calc(19.5% - 1em);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .pagination:nth-child(3) {
    width: 80%;
    margin: 0 auto;

    @include bp-sm-phone-landscape {
      width: 100%;
    }
  }
}
</style>
