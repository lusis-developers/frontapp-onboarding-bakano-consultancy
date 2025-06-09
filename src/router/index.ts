import NotFound from '@/views/notFound.vue'
import OnBoarding from '@/views/onBoarding.vue'
import { defineComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const Blank = defineComponent({ name: 'Blank', template: '<div />' })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root-redirect',
      component: Blank,
      beforeEnter() {
        window.location.replace('https://bakano.ec')
      },
    },
    {
      path: '/:userId/:businessId',
      name: 'onboarding',
      component: OnBoarding,
      props: (route) => ({
        userId: route.params.userId as string,
        businessId: route.params.businessId as string,
      }),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

export default router
