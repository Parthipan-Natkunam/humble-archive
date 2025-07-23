<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner text="Loading books..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <ExclamationTriangleIcon class="w-16 h-16 text-error-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-200 mb-2">Group not found</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <router-link to="/groups" class="btn-primary">
          Back to Groups
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-4 mb-2">
            <router-link
              to="/groups"
              class="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </router-link>
            <h1 class="text-3xl font-bold text-gray-100">{{ group.name }}</h1>
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-400">
            <div class="flex items-center space-x-2">
              <BookOpenIcon class="w-4 h-4" />
              <span>{{ totalBooks }} books</span>
            </div>
            <div class="flex items-center space-x-2">
              <CalendarIcon class="w-4 h-4" />
              <span>Created {{ formatDate(group.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div class="flex space-x-3 mt-4 sm:mt-0">
          <button
            @click="exportBooks"
            class="btn-outline inline-flex items-center space-x-2"
          >
            <ArrowDownTrayIcon class="w-4 h-4" />
            <span>Export</span>
          </button>
          <router-link
            to="/"
            class="btn-primary inline-flex items-center space-x-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>New Scrape</span>
          </router-link>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search books..."
              class="input-field pl-10 w-full"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <select
            v-model="sortBy"
            class="input-field"
          >
            <option value="createdAt">Date Added</option>
            <option value="title">Title</option>
            <option value="edition">Edition</option>
          </select>
        </div>
      </div>

      <!-- Books Grid -->
      <div v-if="filteredBooks.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <BookOpenIcon class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-200 mb-2">No books found</h3>
          <p class="text-gray-400 mb-6">
            {{ searchQuery ? 'No books match your search.' : 'This group is empty.' }}
          </p>
          <router-link to="/" class="btn-primary">
            Start Scraping
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <BookCard
            v-for="book in paginatedBooks"
            :key="book.id"
            :book="book"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredBooks.length"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'
import apiService from '@/services/ApiService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Pagination from '@/components/Pagination.vue'
import BookCard from '@/components/BookCard.vue'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const error = ref(null)
const group = ref({})
const books = ref([])
const searchQuery = ref('')
const sortBy = ref('createdAt')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed properties
const filteredBooks = computed(() => {
  let filtered = books.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) ||
      (book.edition && book.edition.toLowerCase().includes(query))
    )
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'edition':
        return (a.edition || '').localeCompare(b.edition || '')
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

const totalBooks = computed(() => books.value.length)

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value)
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
})

// Methods
const loadGroupDetails = async () => {
  const groupId = route.params.id
  
  if (!groupId) {
    error.value = 'Invalid group ID'
    return
  }

  isLoading.value = true
  error.value = null
  
  try {
    const response = await apiService.getGroupBooks(groupId, 1, 1000) // Load all books
    if (response.success) {
      group.value = response.data.group
      books.value = response.data.books
    }
  } catch (err) {
    error.value = err.message || 'Failed to load group details'
    notificationStore.error('Failed to load group details')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const exportBooks = () => {
  const csvContent = generateCSV()
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${group.value.name}_books.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  notificationStore.success('Books exported successfully!')
}

const generateCSV = () => {
  const headers = ['Title', 'Edition', 'Image URL', 'Source URL', 'Created At']
  const rows = books.value.map(book => [
    book.title,
    book.edition || '',
    book.imageUrl || '',
    book.sourceUrl,
    new Date(book.createdAt).toLocaleDateString()
  ])
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(sortBy, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  loadGroupDetails()
})
</script> 