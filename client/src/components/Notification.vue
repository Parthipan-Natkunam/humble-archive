<template>
  <div class="fixed top-20 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="getNotificationClasses(notification.type)"
      >
        <div class="flex items-start space-x-3 p-4 rounded-lg shadow-lg max-w-sm">
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="notification.type === 'success'" class="w-5 h-5 text-success-400" />
            <ExclamationTriangleIcon v-else-if="notification.type === 'warning'" class="w-5 h-5 text-yellow-400" />
            <ExclamationCircleIcon v-else-if="notification.type === 'error'" class="w-5 h-5 text-error-400" />
            <InformationCircleIcon v-else class="w-5 h-5 text-primary-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-100">
              {{ notification.message }}
            </p>
          </div>
          <div class="flex-shrink-0">
            <button
              @click="removeNotification(notification.id)"
              class="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore

const getNotificationClasses = (type) => {
  const baseClasses = 'animate-slide-up'
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-success-900/90 border border-success-700`
    case 'error':
      return `${baseClasses} bg-error-900/90 border border-error-700`
    case 'warning':
      return `${baseClasses} bg-yellow-900/90 border border-yellow-700`
    default:
      return `${baseClasses} bg-dark-900/90 border border-dark-700`
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 