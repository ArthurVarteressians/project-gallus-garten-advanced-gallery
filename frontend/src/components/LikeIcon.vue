<template>
  <div
    class="absolute top-2 right-2 flex items-center space-x-1 cursor-pointer bg-white rounded-full px-2 py-1 shadow-md"
    @click="incrementLikes"
  >
    <!-- Leaf Icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      :class="leafColor"
      class="w-6 h-6"
    >
      <path
        d="M12 2C8.14 2 5 5.14 5 9c0 4.44 7 11 7 11s7-6.56 7-11c0-3.86-3.14-7-7-7zM9 9H7V7h2v2zm8 0h-2V7h2v2z"
      />
    </svg>

    <!-- Likes Count -->
    <span class="text-gray-700 text-sm font-semibold">{{ currentLikes }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue';
import api from '../api'; // Centralized API instance

// Destructure props directly from defineProps
const props = defineProps({
  initialLikes: {
    type: Number,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
});

// Reactive state for likes
const currentLikes = ref(props.initialLikes);

// Compute leaf color dynamically based on likes
const leafColor = computed(() => {
  if (currentLikes.value < 50) return 'text-green-300'; // Light green
  if (currentLikes.value >= 50 && currentLikes.value <= 100) return 'text-green-500'; // Medium green
  return 'text-green-700'; // Dark green
});

// Handle the click to increment likes
const incrementLikes = async () => {
  try {
    // Use the centralized API instance with baseURL
    const response = await api.post(`/likes/${props.imageId}/like`);
    currentLikes.value = response.data.likes; // Update likes count dynamically
  } catch (error) {
    console.error('Error incrementing likes:', error);
  }
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
