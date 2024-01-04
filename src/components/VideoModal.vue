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
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`" allow="autoplay" allowfullscreen>
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
        transform: translate(-50%, -50%);
        width: 50vw;
        height: 30vw;
    }
}
</style>