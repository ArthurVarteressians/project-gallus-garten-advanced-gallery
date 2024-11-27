<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Filter Dropdown -->
    <GalleryFilter @filterChanged="updateFilter" />

    <!-- Main Gallery -->
    <main
      class="w-full max-w-6xl h-[80vh] overflow-y-auto p-4"
      ref="galleryContainer"
    >
      <!-- Skeleton Loader -->
      <SkeletonLoader v-if="loading" :count="9" />

      <!-- Image Grid -->
      <div
        v-else
        class="grid grid-cols-2 max-sm:grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-1"
      >
        <div
          v-for="image in images"
          :key="image.publicId"
          class="relative group w-full h-[25vh] max-sm:h-[15vh] sm:h-[22vh] md:h-[26vh] overflow-hidden bg-gray-300"
        >
          <!-- Image -->
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          <!-- Overlay -->
          <div
            class="absolute bottom-0 w-full h-[30%] bg-black bg-opacity-60 opacity-0 sm:opacity-0 sm:group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center text-white font-light"
          >
            {{ image.description }}
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading && !error" class="text-center py-4">Loading...</div>

      <!-- No More Images -->
      <div
        v-if="allDataLoaded && !error"
        class="text-center py-4 text-gray-500"
      >
        No more images to load
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import GalleryFilter from "./GalleryFilers.vue";
import SkeletonLoader from "./SkeletonLoader.vue";
import { ref, onMounted } from "vue";
import api from "../api";

// Define the Image interface
interface Image {
  publicId: string;
  url: string;
  description: string;
}

// Reactive variables
const images = ref<Image[]>([]); // Stores the loaded images
const loading = ref(false); // Loading state
const page = ref(1);
const allDataLoaded = ref(false); // Whether all images are loaded
const galleryContainer = ref<HTMLElement | null>(null); // Ref for the scrollable container
const error = ref(false); // Error state
const selectedTag = ref<string | null>(null); // Currently selected tag for filtering

const loadImages = async (tag: string | null = null, reset = false) => {
  if (loading.value || allDataLoaded.value) return;

  loading.value = true;
  error.value = false;

  const container = galleryContainer.value;

  // Save the current scroll position
  const currentScroll = container?.scrollTop || 0;

  try {
    if (reset) {
      images.value = []; // Clear images if resetting
      page.value = 1; // Reset page
    }

    const response = await api.get("/images", {
      params: { page: page.value, tag },
    });

    if (response.data.images && response.data.images.length > 0) {
      images.value.push(...response.data.images); // Append fetched images
      page.value++; // Increment page
      allDataLoaded.value = !response.data.hasMore; // Check if more data is available
    } else {
      allDataLoaded.value = true; // Mark all data as loaded
    }
  } catch (err) {
    console.error("Error loading images:", err);
    error.value = true;
  } finally {
    loading.value = false;

    // Use requestAnimationFrame to restore scroll position after DOM updates
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = currentScroll;
      });
    }
  }
};

const updateFilter = (tag: string | null) => {
  if (selectedTag.value === tag) return; // Skip if the same tag is selected

  selectedTag.value = tag; // Update the selected tag
  allDataLoaded.value = false; // Reset "all loaded" state
  loadImages(tag, true); // Reset images and fetch new data
};

// Infinite scrolling
const handleScroll = () => {
  const container = galleryContainer.value;
  if (
    container &&
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10
  ) {
    loadImages(selectedTag.value); // Load more images for the current tag
  }
};

// Initialize component
onMounted(() => {
  loadImages(); // Load all images by default
  galleryContainer.value?.addEventListener("scroll", handleScroll); // Add scroll listener
});
</script>
