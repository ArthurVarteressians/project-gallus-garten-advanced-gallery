<template>
  <div
    class="absolute top-2 right-2 flex items-center space-x-1 cursor-pointer bg-white rounded-full px-2 py-1 shadow-md"
    @click="incrementLikes"
  >
    <!-- Leaf Icon -->
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <!-- Apply dynamic fill color -->
        <path
          :fill="leafColor"
          d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
          transform="rotate(36 43.17 23.237)"
        />
        <path
          stroke="#22BA8E"
          stroke-linecap="round"
          stroke-width="3"
          d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
        />
        <polyline
          stroke="#22BA8E"
          stroke-linecap="round"
          stroke-width="2"
          points="41.946 36.659 32.202 36.245 27.486 27.936"
        />
        <polyline
          stroke="#22BA8E"
          stroke-linecap="round"
          stroke-width="2"
          points="44.938 27.965 38.294 26.606 36.16 21.188"
        />
      </g>
    </svg>

    <!-- Likes Count -->
    <span class="text-gray-700 text-sm font-semibold">{{ currentLikes }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from "vue";
import api from "../api"; // Centralized API instance

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
  if (currentLikes.value < 50) return "#80D25B"; // Light green
  if (currentLikes.value >= 50 && currentLikes.value <= 100) return "#22BA8E"; // Medium green
  return "#0F7A4A"; // Dark green
});

// Handle the click to increment likes
const incrementLikes = async () => {
  try {
    // Use the centralized API instance with baseURL
    const response = await api.post(`/likes/${props.imageId}/like`);
    currentLikes.value = response.data.likes; // Update likes count dynamically
  } catch (error) {
    console.error("Error incrementing likes:", error);
  }
};
</script>

<style scoped>
</style>
