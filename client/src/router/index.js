import { createRouter, createWebHistory } from 'vue-router'
import ScrapeView from '@/views/ScrapeView.vue'
import GroupsView from '@/views/GroupsView.vue'
import GroupDetailsView from '@/views/GroupDetailsView.vue'

const routes = [
  {
    path: '/',
    name: 'Scrape',
    component: ScrapeView,
    meta: { title: 'Scrape Books' }
  },
  {
    path: '/groups',
    name: 'Groups',
    component: GroupsView,
    meta: { title: 'Book Groups' }
  },
  {
    path: '/groups/:id',
    name: 'GroupDetails',
    component: GroupDetailsView,
    meta: { title: 'Group Details' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Book Scraper`
  next()
})

export default router 