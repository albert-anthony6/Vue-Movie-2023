<script lang="ts" setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="not-found">
        <div class="content">
            <h1>This page could not be found.</h1>
            <img src="/src/assets/images/404.png" alt="404.">
            <RouterLink to="/">
                Go Back
                <font-awesome-icon class="fa-icon" icon="fa-solid fa-arrow-right" />
            </RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.not-found {
    position: relative;
    padding: 150px 0 50px;
    min-height: 100vh;
    background-image: url('@/assets/images/test.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        h1 {
            text-transform: uppercase;
        }
    
        img {
            display: block;
            margin: 0 auto;
            width: 350px;
            height: 350px;
    
            @include bp-xs-phone {
                width: 384px;
                height: 384px;
            }
        }

        a {
            font-size: rem(22);
  
            &:hover svg {
                transform: translateX(5px);
            }

            svg {
                transition: transform 0.3s ease;
                vertical-align: middle;
                margin-bottom: 2px;
            }
        }
    }

}
</style>