<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Navigation -->
    <nav class="glass border-b border-dark-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gradient">Humble Keeper</span>
          </router-link>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              :class="{ 'text-primary-400': $route.path === '/' }"
            >
              Scrape
            </router-link>
            <router-link 
              to="/groups" 
              class="text-gray-300 hover:text-white transition-colors duration-200"
              :class="{ 'text-primary-400': $route.path === '/groups' }"
            >
              Groups
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-300 hover:text-white p-2"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
              <XMarkIcon v-else class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-dark-700">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link 
              to="/" 
              class="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              :class="{ 'text-primary-400': $route.path === '/' }"
              @click="mobileMenuOpen = false"
            >
              Scrape
            </router-link>
            <router-link 
              to="/groups" 
              class="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
              :class="{ 'text-primary-400': $route.path === '/groups' }"
              @click="mobileMenuOpen = false"
            >
              Groups
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <!-- Notification -->
    <Notification />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BookOpenIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import Notification from '@/components/Notification.vue'

const mobileMenuOpen = ref(false)
</script> 