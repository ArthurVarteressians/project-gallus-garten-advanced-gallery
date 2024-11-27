<template>
     <div
       v-if="isVisible"
       class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
     >
       <div class="relative bg-white rounded-lg shadow-lg w-[90vw] sm:w-[70vw] md:w-[50vw]">
         <!-- Close Button -->
         <button
           @click="closeModal"
           class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
         >
           ✕
         </button>
   
         <!-- Image -->
         <img
           :src="image?.url"
           :alt="image?.description"
           class="w-full h-auto rounded-t-lg"
         />
   
         <!-- Description -->
         <div class="p-4 text-center">
           <p class="text-gray-700 font-medium">{{ image?.description }}</p>
         </div>
       </div>
     </div>
   </template>
   
   <script lang="ts" setup>
   import { ref, defineProps, defineEmits } from "vue";
   
   // Props to receive image data and visibility state
   defineProps({
     isVisible: { type: Boolean, required: true },
     image: { type: Object as () => { url: string; description: string } | null, required: true },
   });
   
   // Emit event to close the modal
   const emit = defineEmits(["closeModal"]);
   
   const closeModal = () => {
     emit("closeModal");
   };
   </script>
   