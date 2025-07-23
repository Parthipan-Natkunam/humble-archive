<template>
  <div class="card-hover group">
    <div class="aspect-w-2 aspect-h-3 mb-4 overflow-hidden rounded-lg">
      <img
        v-if="book.imageUrl"
        :src="book.imageUrl"
        :alt="book.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        @error="handleImageError"
      />
      <div
        v-else
        class="w-full h-48 bg-dark-800 flex items-center justify-center"
      >
        <BookOpenIcon class="w-12 h-12 text-dark-600" />
      </div>
    </div>
    
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-gray-100 line-clamp-2 group-hover:text-primary-400 transition-colors duration-200">
        {{ book.title }}
      </h3>
      
      <div v-if="book.edition" class="flex items-center space-x-2">
        <TagIcon class="w-4 h-4 text-gray-400" />
        <span class="text-sm text-gray-400">{{ book.edition }}</span>
      </div>
      
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center space-x-2 text-xs text-gray-500">
          <CalendarIcon class="w-4 h-4" />
          <span>{{ formatDate(book.createdAt) }}</span>
        </div>
        
        <button
          @click="openSourceUrl"
          class="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200"
        >
          View Source
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpenIcon, TagIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling.style.display = 'flex'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openSourceUrl = () => {
  if (props.book.sourceUrl) {
    window.open(props.book.sourceUrl, '_blank')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 