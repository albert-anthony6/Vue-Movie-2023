<script lang="ts" setup>
const emit = defineEmits(['toggle-modal'])

interface Props {
    trailerKey: string;
}

defineProps<Props>();
</script>

<template>
    <div class="video-modal" @click="emit('toggle-modal')">
        <iframe 
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&fullscreen=1`"
            allow="autoplay *; fullscreen *"
            allowfullscreen
        >
            <p>Your browser does not support iframes.</p>
        </iframe>
    </div>
</template>

<style lang="scss" scoped>
.video-modal {
    position: fixed;
    width: 100vw;
    height: 100svh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba($darkest-neutral, 0.5);
    backdrop-filter: blur(8px);
    z-index: 999;
    
    iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80vw;
        min-height: 80vw;
        transform: translate(-50%, -50%);
        
        @include bp-sm-phone-landscape {
            min-height: 50vw;
        }
        
        @include bp-custom-min(1400) {
            width: 50vw;
            min-height: 30vw;
        }
    }
}
</style>