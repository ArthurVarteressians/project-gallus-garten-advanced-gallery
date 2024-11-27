<template>
  <div class="w-[80vw] flex flex-row justify-end m-2 relative">
    <div class="w-full md:w-3/12 relative dropdown-container">
      <label class="block mb-2 text-sm md:text-base text-gray-700 font-medium">
        Filter by Category:
      </label>
      <div
        @click="toggleCategoryDropdown"
        class="p-2 border w-full text-sm md:text-base bg-white shadow cursor-pointer flex justify-between items-center"
      >
        <span>{{ selectedCategory || "All Categories" }}</span>
      </div>
      <ul
        v-if="isCategoryDropdownActive"
        class="absolute bg-green-400 border bg-opacity-95 border-green-600 w-full max-h-[30vh] p-2 overflow-y-auto mt-2 z-50 shadow-lg transition-all duration-300 ease-in-out transform origin-top"
        :class="dropdownAnimationClass"
      >
        <!-- Add "All Categories" option -->
        <li
          @click="selectCategory(null)"
          class="p-2 cursor-pointer hover:bg-green-200 text-gray-700"
        >
          All Categories
        </li>

        <!-- List all other categories -->
        <li
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          class="p-2 cursor-pointer hover:bg-green-100 text-gray-700"
        >
          {{ category }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, onBeforeUnmount } from "vue";
import axios from "axios";

// Reactive states
const categories = ref<string[]>([]); // List of categories
const selectedCategory = ref<string | null>(null); // Currently selected category
const isCategoryDropdownActive = ref(false); // Dropdown visibility control
const dropdownAnimationClass = ref("scale-y-100 opacity-100"); // Animation state

// Emit selected category to the parent
const emit = defineEmits(["filterChanged"]);

// Fetch categories from backend
const fetchCategories = async () => {
  try {
    const response = await axios.get("http://localhost:5002/api/images/filter");
    categories.value = response.data.tags;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Toggle dropdown visibility
const toggleCategoryDropdown = () => {
  isCategoryDropdownActive.value = !isCategoryDropdownActive.value;
  dropdownAnimationClass.value = isCategoryDropdownActive.value
    ? "scale-y-100 opacity-100"
    : "scale-y-0 opacity-0";
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const dropdownContainer = document.querySelector(".dropdown-container");
  if (dropdownContainer && !dropdownContainer.contains(target)) {
    isCategoryDropdownActive.value = false;
    dropdownAnimationClass.value = "scale-y-0 opacity-0";
  }
};

// Add event listener for clicks outside dropdown
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchCategories();
});

// Remove event listener to avoid memory leaks
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Handle category selection
const selectCategory = (category: string | null) => {
  selectedCategory.value = category;
  emit("filterChanged", category); // Emit selected category to the parent
  isCategoryDropdownActive.value = false; // Close dropdown
  dropdownAnimationClass.value = "scale-y-0 opacity-0";
};
</script>
