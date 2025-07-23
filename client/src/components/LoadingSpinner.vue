<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <div class="w-8 h-8 border-2 border-dark-600 border-t-primary-500 rounded-full animate-spin"></div>
      <div class="w-8 h-8 border-2 border-transparent border-t-primary-400 rounded-full animate-spin absolute top-0 left-0" style="animation-delay: 0.1s"></div>
    </div>
    <span v-if="text" class="ml-3 text-gray-400">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script> 