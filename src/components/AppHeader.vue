<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useMq } from "vue3-mq";
import { RouterLink, useRoute, useRouter } from 'vue-router';
import useShowsStore from '@/stores/shows';
import DropdownMenu from '@/components/DropdownMenu.vue';
import IconTMDBLogo from '@/assets/icons/icon_tmdb_logo.svg';

const route = useRoute();
const router = useRouter();

const mq = useMq();

const isMenuOpen = ref(false);
const dropdownValue = ref('movie');
const dropdownOption = ref([
    {
        name: 'Movies',
        value: 'movie'
    },
    {
        name: 'TV',
        value: 'tv'
    }
]);

function goToSearchPage() {
    showsStore.searchInfo = { searchValue: searchValue.value, dropdownValue: dropdownValue.value };
    router.push({ name: 'search', query: { type: dropdownValue.value, value: searchValue.value } });
    isMenuOpen.value = false;
}

let timeout: ReturnType<typeof setTimeout> | null;
const searchValue = ref('');
const showsStore = useShowsStore();

function debounceSearch(delayMs: number) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    // Do nothing if search value is empty
    if (!searchValue.value) return;

    timeout = setTimeout(() => {
        goToSearchPage();
    }, delayMs || 3000)
}

function closeMenu() {
    if (isMenuOpen.value) {
        isMenuOpen.value = false;
    }
}

// Close mobile menu if screen width is too large
watch(
    () => [mq.lgPlus],
    () => {
        if (mq.lgPlus && isMenuOpen.value) {
            isMenuOpen.value = false;
        }
    },
)
</script>

<template>
    <header :class="isMenuOpen ? 'mobile-menu' : 'app-header'">
        <div class="header-content">
            <RouterLink to="/" class="logo">
                <IconTMDBLogo />
            </RouterLink>
            <ul class="nav-options">
                <li>
                    <div class="search-container">
                        <input v-model="searchValue" type="text" placeholder="Search..." @input="debounceSearch(1000)">
                        <DropdownMenu v-model="dropdownValue" @updateSearch="goToSearchPage" :options="dropdownOption" class="dropdown" />
                    </div>
                </li>
                <li>
                    <a
                        :href="route.name !== 'show' ? `${route.path}?type=movies` : '/?type=movies'"
                        @click="closeMenu"
                        :class="{ active: route.query.type?.includes('movie') || !route.query.type }"
                    >
                        Movies
                    </a>
                </li>
                <li>
                    <a
                        :href="route.name !== 'show' && !route.query.value ? `${route.path}?type=tv` : '/?type=tv'"
                        @click="closeMenu"
                        :class="{ active: route.query.type === 'tv' }"
                    >
                        TV Shows
                    </a>
                </li>
            </ul>
            <div class="menu-icon" @click="isMenuOpen = !isMenuOpen" :class="{'menu-active': isMenuOpen}">
                <span />
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.app-header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba($darkest-neutral, 0.5);
    z-index: 998;
    backdrop-filter: blur(30px);
    padding: 15px 40px 8px;

    .header-content,
    .nav-options {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header-content {
        width: 90%;
        max-width: 1400px;
        margin: 0 auto;

        @include bp-xxl-desktop-large {
            width: 100%;
            padding: unset;
        }

        svg {
            width: 100px;
        }

        .nav-options {
            display: none;

            @include bp-lg-laptop {
                display: flex;
            }

            li {
                margin: 0 15px;
                transition: color 0.5s ease;
    
                &:last-child {
                    margin-right: 0;
                }

                &:hover {
                    color: #ff70e0;
                }
            }
        }

        .active {
            color: #ff70e0;
        }
    }
}

.search-container {
    position: relative;
    display: flex;
    width: fit-content;
    margin: 15px 30px;
    text-align: center;

    @include bp-lg-laptop {
        margin: unset;
    }

    input {
        font-size: rem(16);
        margin-right: 61px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        
        @include bp-lg-laptop {
            font-size: rem(13.5);
         }
    }

    .dropdown {
        position: absolute;
        top: 0;
        right: 0;
        height: 102%;
    }

    :deep() {
        .dropdown-menu {
            font-size: rem(14);
            padding: unset;
            margin: unset;
            min-width: 61px;
            
            .selected-option {
                height: 100%;
                color: $lightest-neutral;
                background-color: red;
                border: 1px solid red;
                padding: 8px 5px;
                margin: unset;
                border-radius: 0;
                border-start-end-radius: 3px;
                border-end-end-radius: 3px;
                
                @include bp-lg-laptop {
                    padding: 5px;
                 }
            }

            .option {
                padding: 10px 0;
                color: $darkest-neutral;
                background-color: $lightest-neutral;
                transition: all 0.3s ease;

                &:hover {
                    color: $lightest-neutral;
                    background-color: red;
                }
            }
        }
    }
}

.mobile-menu {
    position: fixed;
    min-height: 100svh;
    width: 100%;
    background-color: rgba($darkest-neutral, 0.5);
    backdrop-filter: blur(30px);
    z-index: 998;

    @include bp-lg-laptop {
        display: none;
    }

    .header-content {
        padding: 30px 0 0;
        
        .fa-icon {
            font-size: rem(50);
        }

        .logo {
            display: inline-block;
            width: 150px;
            margin: 0 auto;
        }

        .menu-icon {
            position: absolute;
            top: 40px;
            right: 25px;
            
            @include bp-sm-phone-landscape {
                right: 50px;
            }
        }
        
        .nav-options {
            text-align: left;
            margin-top: 20px;

            a {
                display: block;
                width: 100%;
                cursor: pointer;
                font-size: rem(24);
                font-weight: 300;
                padding: 15px 30px;
                transition: background-color 0.2s ease;

                &:hover {
                    background-color: red;
                }
            }
        }
    }
}
.fa-icon {
    animation: 2s ease-in-out 0s infinite alternate sway;
    transition: all .5s ease;
}

.menu-icon {
    position: relative;
    height: 32px;
    width: 40px;
    cursor: pointer;
    transition: all .5s ease;

    @include bp-lg-laptop {
        display: none;
    }

    & span,
    & span::before,
    & span::after {
        background-color: white; 
        content: '';
        position: absolute;
        width: 40px;
        left: 0;
        height: 6px;         
        margin-top: 13px;
        
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);

        -webkit-transition: .5s ease-in-out;
        -moz-transition: .5s ease-in-out;
        -o-transition: .5s ease-in-out;
        transition: .5s ease-in-out;
    }

    & span::before {
        margin-top:-12px;
    }

    & span::after {
        margin-top:12px;
    }

    &.menu-active span {
        background-color: transparent;
        transition: background-color 0s ease;

        &::before {
            background-color: red;
            margin-top: 0;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        &::after {
            background-color: red;
            transform: rotate(-45deg);
            margin-top: 0;
        }
    }
}
</style>
