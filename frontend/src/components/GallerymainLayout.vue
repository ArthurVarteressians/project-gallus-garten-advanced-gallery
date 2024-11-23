<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Awesome Gallery</h1>
    </header>

    <!-- Main Gallery -->
    <main
      class="w-full max-w-6xl h-[80vh] overflow-y-auto p-4"
      ref="galleryContainer"
    >
      <!-- Skeleton Layout (Displayed When Error Occurs) -->
      <SkeletonLoader v-if="error" :count="9" />

      <!-- Image Grid (Displayed When No Error) -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="image in images"
          :key="image.publicId"
          class="relative w-full h-[25vh] rounded-lg overflow-hidden bg-gray-300"
        >
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Loading Indicator (For Normal Loading) -->
      <div v-if="loading && !error" class="text-center py-4">Loading...</div>

      <!-- No More Images -->
      <div v-if="allDataLoaded && !error" class="text-center py-4 text-gray-500">
        No more images to load
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <p class="text-sm">Gallery Footer</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import SkeletonLoader from "./SkeletonLoader.vue"; // Import the skeleton loader component

import { ref, onMounted } from "vue";
import axios from "axios";

// Define the Image interface
interface Image {
  publicId: string;
  url: string;
  description: string;
}

// Reactive variables
const images = ref<Image[]>([]); // Stores loaded images
const loading = ref(false); // Indicates if data is loading
const page = ref(1); // Tracks current page
const allDataLoaded = ref(false); // Indicates if all images are loaded
const galleryContainer = ref<HTMLElement | null>(null); // Ref for scrolling container
const error = ref(false); // Tracks if there is a connection or server error

// Load images from the API
const loadImages = async () => {
  if (loading.value || allDataLoaded.value) return; // Prevent multiple requests

  loading.value = true;
  error.value = false; // Reset error state
  try {
    const response = await axios.get(
      `http://localhost:5002/api/images?page=${page.value}`
    );

    if (response.data.images && response.data.images.length > 0) {
      images.value.push(...response.data.images); // Append new images
      page.value++; // Increment page
      allDataLoaded.value = !response.data.hasMore; // Check if more data is available
    } else {
      allDataLoaded.value = true; // No more images
    }
  } catch (err) {
    console.error("Error loading images:", err);
    error.value = true; // Set error state to display skeleton layout
  } finally {
    loading.value = false; // Reset loading state
  }
};

// Infinite scrolling
const handleScroll = () => {
  const container = galleryContainer.value;
  if (
    container &&
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10
  ) {
    loadImages();
  }
};

// Mounting logic
onMounted(() => {
  loadImages(); // Load initial images
  galleryContainer.value?.addEventListener("scroll", handleScroll); // Add scroll listener
});
</script>



<style scoped>
main {
  scrollbar-width: thin;
  scrollbar-color: #888888a8 transparent;
  scroll-behavior: smooth;
}
</style>
