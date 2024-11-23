<template>        

  <div class="flex justify-center items-center h-[80vh]"> 
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-9 w-2/4 lg:grid-cols-3 p-6">
    <div
      v-for="index in 9"
      :key="index"
      class="skeleton-item p-4 bg-gray-50 rounded-lg shadow-md"
    >
      <div
        class="skeleton-square m-auto w-[80px] p-8 h-[80px] mt-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-bounce"
      ></div>
    </div>
  </div></div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
