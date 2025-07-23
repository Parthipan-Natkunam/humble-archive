<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-100">Book Groups</h1>
        <p class="text-gray-400 mt-2">Manage and view your scraped book collections</p>
      </div>
      <router-link
        to="/"
        class="btn-primary mt-4 sm:mt-0 inline-flex items-center space-x-2"
      >
        <PlusIcon class="w-5 h-5" />
        <span>New Scrape</span>
      </router-link>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search groups..."
            class="input-field pl-10 w-full"
          />
        </div>
      </div>
      <div class="flex gap-2">
        <select
          v-model="sortBy"
          class="input-field"
        >
          <option value="createdAt">Date Created</option>
          <option value="name">Name</option>
          <option value="bookCount">Book Count</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner text="Loading groups..." />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredGroups.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <FolderIcon class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-200 mb-2">No groups found</h3>
        <p class="text-gray-400 mb-6">
          {{ searchQuery ? 'No groups match your search.' : 'Start by scraping some books to create your first group.' }}
        </p>
        <router-link
          to="/"
          class="btn-primary inline-flex items-center space-x-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Start Scraping</span>
        </router-link>
      </div>
    </div>

    <!-- Groups Grid -->
    <div v-else class="space-y-6">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="group in paginatedGroups"
          :key="group.id"
          class="card-hover"
          @click="viewGroup(group.id)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-100 mb-1">{{ group.name }}</h3>
              <p class="text-sm text-gray-400">
                {{ formatDate(group.createdAt) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <BookOpenIcon class="w-5 h-5 text-primary-400" />
              <span class="text-sm font-medium text-primary-400">{{ group.bookCount }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <CalendarIcon class="w-4 h-4" />
              <span>{{ formatTimeAgo(group.createdAt) }}</span>
            </div>
            <button
              @click.stop="viewGroup(group.id)"
              class="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200"
            >
              View Books →
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="filteredGroups.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'
import apiService from '@/services/ApiService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Pagination from '@/components/Pagination.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  BookOpenIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const groups = ref([])
const searchQuery = ref('')
const sortBy = ref('createdAt')
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Computed properties
const filteredGroups = computed(() => {
  let filtered = groups.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(group => 
      group.name.toLowerCase().includes(query)
    )
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'bookCount':
        return b.bookCount - a.bookCount
      case 'createdAt':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredGroups.value.length / itemsPerPage.value)
})

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGroups.value.slice(start, end)
})

// Methods
const loadGroups = async () => {
  isLoading.value = true
  
  try {
    // Load groups with proper pagination to get all groups
    let allGroups = []
    let page = 1
    const limit = 50 // Maximum allowed by the API
    
    while (true) {
      const response = await apiService.getGroups(page, limit)
      if (response.success) {
        allGroups = allGroups.concat(response.data.groups)
        
        // Check if we've loaded all groups
        if (response.data.groups.length < limit || page * limit >= response.data.pagination.totalItems) {
          break
        }
        page++
      } else {
        break
      }
    }
    
    groups.value = allGroups
  } catch (error) {
    notificationStore.error('Failed to load groups')
  } finally {
    isLoading.value = false
  }
}

const viewGroup = (groupId) => {
  router.push(`/groups/${groupId}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
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
  loadGroups()
})
</script> 