<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import useShowsStore from '@/stores/shows';

const emit = defineEmits(['update:modelValue', 'updateSearch'])

const showsStore = useShowsStore();

const isDropdownVisible = ref(false);
const selectedOption = ref('Movies');
const dropdown = ref();

interface Props {
    options: Array<{
        name: string,
        value: string
    }>,
    modelValue: string
}

defineProps<Props>();

function closeDropdown(element: Event) {
    if (!dropdown.value.contains(element.target)) {
        isDropdownVisible.value = false;
    }
}

function toggleOptionSelect(option: {name: string, value: string}) {
    selectedOption.value = option.name;
    emit('update:modelValue', option.value);
    isDropdownVisible.value = false;

    if (showsStore.searchInfo.searchValue) {
        emit('updateSearch');
    }
}

onMounted(() => {
    window.addEventListener('click', closeDropdown);
})

onBeforeUnmount(() => {
    window.removeEventListener('click', closeDropdown);
})
</script>

<template>
    <div class="dropdown-menu" ref="dropdown">
        <div @click="isDropdownVisible = !isDropdownVisible" class="selected-option">
            {{ selectedOption }}
        </div>
        <Transition name="slide-fade">
            <ul v-if="isDropdownVisible" class="options-container">
                <li
                    class="option"
                    v-for="(option, idx) in options"
                    :key="`${option}-${idx}`"
                    @click="toggleOptionSelect(option)"
                >
                    {{ option.name }}
                </li>
            </ul>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.dropdown-menu {
    padding: 16px;
    cursor: pointer;
    max-width: 200px;
    margin: 0 auto;

    .selected-option {
        padding: 16px;
        border: 1px solid $dark-grey;
        border-radius: 8px;
        margin-bottom: 4px;
    }

    .option {
        padding: 16px;
        border: 1px solid $dark-grey;

        &:hover {
            background-color: $light-neutral;
        }

        &:last-of-type {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }

    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateY(-4px);
        opacity: 0;
    }
}
</style>