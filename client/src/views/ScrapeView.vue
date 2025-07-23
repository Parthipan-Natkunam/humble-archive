<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-gradient">Humble Keeper</h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">
        Archive ebooks bundle list from Humble Bundle.
      </p>
    </div>

    <!-- Scraping Form -->
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <form @submit.prevent="handleScrape" class="space-y-6">
          <!-- URL Input -->
          <div>
            <label for="url" class="block text-sm font-medium text-gray-200 mb-2">
              Website URL
            </label>
            <div class="relative">
              <GlobeAltIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="url"
                v-model="form.url"
                type="url"
                required
                placeholder="https://example.com/books"
                class="input-field pl-10 w-full"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Enter the URL of a Humble Books Bundle page.
            </p>
          </div>

          <!-- Group Name Input -->
          <div>
            <label for="groupName" class="block text-sm font-medium text-gray-200 mb-2">
              Group Name
            </label>
            <div class="relative">
              <FolderIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="groupName"
                v-model="form.groupName"
                type="text"
                required
                placeholder="e.g., Computer Science Books"
                class="input-field pl-10 w-full"
                :disabled="isLoading"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Give your scraped books a meaningful group name
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !form.url || !form.groupName"
            class="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSpinner v-if="isLoading" text="Scraping..." />
            <template v-else>
              <MagnifyingGlassIcon class="w-5 h-5" />
              <span>Start Scraping</span>
            </template>
          </button>
        </form>
      </div>
    </div>

    <!-- Recent Activity -->
    <div v-if="recentActivity.length > 0" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold text-gray-100 mb-6">Recent Activity</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="card"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-medium text-gray-100">{{ activity.groupName }}</h3>
              <p class="text-sm text-gray-400 mt-1">{{ activity.url }}</p>
              <p class="text-sm text-primary-400 mt-2">
                {{ activity.booksScraped }} books scraped
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
              <router-link
                :to="`/groups/${activity.groupId}`"
                class="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                View Books
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips Section -->
    <div class="max-w-4xl mx-auto">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-100 mb-4">Tips for Better Results</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex items-start space-x-3">
            <CheckCircleIcon class="w-5 h-5 text-success-400 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-200">Use Book-Specific Pages</h4>
              <p class="text-sm text-gray-400">Pages with book listings work best</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <CheckCircleIcon class="w-5 h-5 text-success-400 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-200">Check Website Structure</h4>
              <p class="text-sm text-gray-400">Ensure the page has book information</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <CheckCircleIcon class="w-5 h-5 text-success-400 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-200">Descriptive Group Names</h4>
              <p class="text-sm text-gray-400">Use clear names to organize your books</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <CheckCircleIcon class="w-5 h-5 text-success-400 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-200">Respect Website Terms</h4>
              <p class="text-sm text-gray-400">Only scrape publicly available content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'
import apiService from '@/services/ApiService'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import {
  GlobeAltIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const recentActivity = ref([])

const form = reactive({
  url: '',
  groupName: ''
})

const handleScrape = async () => {
  if (!form.url || !form.groupName) return

  isLoading.value = true
  
  try {
    const response = await apiService.scrapeBooks(form.url, form.groupName)
    
    if (response.success) {
      notificationStore.success(`Successfully scraped ${response.data.booksScraped} books!`)
      
      // Add to recent activity
      recentActivity.value.unshift({
        id: Date.now(),
        groupId: response.data.groupId,
        groupName: response.data.groupName,
        url: form.url,
        booksScraped: response.data.booksScraped,
        timestamp: new Date()
      })
      
      // Keep only last 6 activities
      if (recentActivity.value.length > 6) {
        recentActivity.value = recentActivity.value.slice(0, 6)
      }
      
      // Reset form
      form.url = ''
      form.groupName = ''
      
      // Navigate to the new group
      router.push(`/groups/${response.data.groupId}`)
    }
  } catch (error) {
    notificationStore.error(error.message || 'Failed to scrape books')
  } finally {
    isLoading.value = false
  }
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script> 