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
          v-for="(image, index) in images"
          :key="image.publicId"
          class="relative group w-full h-[25vh] max-sm:h-[15vh] sm:h-[22vh] md:h-[26vh] overflow-hidden bg-gray-300"
          @click="openImage(index)"
        >
          <!-- Image -->
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 hover-active"
            loading="lazy"
          />

          <!-- Overlay -->
          <div
            class="absolute bottom-0 left-0 w-full h-[30%] bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white hidden-hover"
          >
            <p class="text-sm font-medium text-center">
              {{ image.description }}
            </p>
          </div>

          <!-- Like Icon -->
          <div
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden-hover"
          >
            <LikeIcon :initialLikes="image.likes" :imageId="image.publicId" />
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

    <!-- Image Modal -->
    <ImageModal
      v-if="selectedImage !== null"
      :isOpen="selectedImage !== null"
      :image="images[selectedImage]"
      :hasPrevious="selectedImage > 0"
      :hasNext="selectedImage < images.length - 1"
      @close="closeImage"
      @next="goToNext"
      @previous="goToPrevious"
    />
  </div>
</template>

<script lang="ts" setup>
import GalleryFilter from "./GalleryFilers.vue";
import SkeletonLoader from "./SkeletonLoader.vue";
import LikeIcon from "./LikeIcon.vue";
import ImageModal from "./ImageModal.vue"; // Import the new modal component
import { ref, onMounted } from "vue";
import api from "../api";

// Define the Image interface
interface Image {
  publicId: string;
  url: string;
  description: string;
  likes: number;
  views: number; // Ensure this is included
}

// Reactive variables
const images = ref<Image[]>([]);
const loading = ref(false);
const page = ref(1);
const allDataLoaded = ref(false);
const galleryContainer = ref<HTMLElement | null>(null);
const error = ref(false);
const selectedTag = ref<string | null>(null);

// Modal logic
const selectedImage = ref<number | null>(null);

const openImage = (index: number) => {
  selectedImage.value = index; // Open the modal with the clicked image
};

const closeImage = () => {
  selectedImage.value = null; // Close the modal
};

const loadImages = async (tag: string | null = null, reset = false) => {
  if (loading.value || allDataLoaded.value) return;

  loading.value = true;
  error.value = false;

  const container = galleryContainer.value;
  const currentScroll = container?.scrollTop || 0;

  try {
    if (reset) {
      images.value = [];
      page.value = 1;
    }

    const response = await api.get("/images", {
      params: { page: page.value, tag },
    });

    if (response.data.images && response.data.images.length > 0) {
      images.value.push(...response.data.images);
      page.value++;
      allDataLoaded.value = !response.data.hasMore;
    } else {
      allDataLoaded.value = true;
    }
  } catch (err) {
    console.error("Error loading images:", err);
    error.value = true;
  } finally {
    loading.value = false;

    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = currentScroll;
      });
    }
  }
};

const updateFilter = (tag: string | null) => {
  if (selectedTag.value === tag) return;

  selectedTag.value = tag;
  allDataLoaded.value = false;
  loadImages(tag, true);
};

const handleScroll = () => {
  const container = galleryContainer.value;
  if (
    container &&
    container.scrollTop + container.clientHeight >= container.scrollHeight - 10
  ) {
    loadImages(selectedTag.value);
  }
};

const goToNext = () => {
  if (
    selectedImage.value !== null &&
    selectedImage.value < images.value.length - 1
  ) {
    selectedImage.value++;
  }
};

const goToPrevious = () => {
  if (selectedImage.value !== null && selectedImage.value > 0) {
    selectedImage.value--;
  }
};

onMounted(() => {
  loadImages();
  galleryContainer.value?.addEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Disable hover for mobile using media queries */
@media (max-width: 640px) {
  .hidden-hover {
    display: none !important; /* Disable hover effects for smaller screens */
  }

  .hover-active {
    transform: none !important;
  }
}
</style>
