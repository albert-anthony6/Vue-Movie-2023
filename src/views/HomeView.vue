<script setup lang="ts">
import { ref } from 'vue';
import AppModal from '@/components/AppModal.vue';
import MainSection from '@/components/home-sections/MainSection.vue';
import ProjectsSection from '@/components/home-sections/ProjectsSection.vue';
import SkillsSection from '@/components/home-sections/SkillsSection.vue';
import WhySection from '@/components/home-sections/WhySection.vue';
import WorkSection from '@/components/home-sections/WorkSection.vue';

const isModalOpen = ref(false);
const modalImg = ref('');

function toggleModal(payload: string) {
  if (!isModalOpen.value) {
    modalImg.value = payload;
  }
  isModalOpen.value = !isModalOpen.value;
}
</script>

<template>
  <div class="home">
    <MainSection id="home" />
    <ProjectsSection  id="projects" />
    <SkillsSection id="skills" />
    <WhySection id="why-me" />
    <WorkSection @toggle-modal="toggleModal($event)" id="work" />
    <AppModal v-if="isModalOpen" :imgPath="modalImg" @toggle-modal="toggleModal" />
  </div>
</template>

<style lang="scss" scoped>
.home {
  #projects,
  #skills {
    width: 90%;
    max-width: 1400px;
    margin: 0 auto;
    
    @include bp-custom-min(1360) {
      width: 80%;
    }
  }

  #skills {
    width: 80%;

    @include bp-lg-laptop {
      width: 90%;
    }
  }
}
</style>
