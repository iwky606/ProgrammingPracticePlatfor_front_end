import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/index.vue";
import LoginView from "@/views/user/LoginView.vue";
import RegisterView from "@/views/user/RegisterView.vue";
import UserView from "@/views/user/index.vue";
import RankView from "@/views/rank/index.vue";
import QuestionView from "@/views/question/QuestionView.vue";
import QuestionListView from "@/views/question/index.vue";
import AdminView from "@/views/admin/index.vue";
import AdminQuestionView from "@/views/admin/QuestionView.vue";
import AdminQuestionSetView from "@/views/admin/QuestionSetView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/user',
      name: 'User',
      component: UserView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/rank',
      name: 'Rank',
      component: RankView
    },
    {
      path: '/questions',
      name: 'Question',
      component: QuestionListView,
    },
    {
      path: '/question/:id',
      name: 'QuestionDetail',
      component: QuestionView
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'question',
          name: 'AdminQuestion',
          component: AdminQuestionView,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'set',
          name: 'AdminQuestionSet',
          component: AdminQuestionSetView,
          meta: {
            requiresAuth: true
          },
        }
      ]
    },
    {
      path: '/forbidden',
      name: '403',
      component: () => import('@/views/error/403.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/error/404.vue')
    }
  ]
})

export default router
