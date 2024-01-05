<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useMq } from "vue3-mq";
import { RouterLink, useRoute } from 'vue-router';
import IconTMDBLogo from '@/assets/icons/icon_tmdb_logo.svg';

const route = useRoute();

const mq = useMq();

const isMenuOpen = ref(false);

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
            <ul>
                <li>
                    <a
                        :href="route.name !== 'show' ? `${route.path}?type=movies` : '/?type=movies'"
                        @click="closeMenu"
                        :class="{ active: route.query.type === 'movies' }"
                    >
                        Movies
                    </a>
                </li>
                <li>
                    <a
                        :href="route.name !== 'show' ? `${route.path}?type=tv` : '/?type=tv'"
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
    ul {
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

        ul {
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
        
        ul {
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
