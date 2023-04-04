import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // }
    {
      path: '/',
      name: "layout",
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: '/',
          name: "所有文章",
          component: () => import('@/views/forum/ArticleList.vue'),
        }, {
          path: '/forum/:pBoardId',
          name: "一级板块",
          component: () => import('@/views/forum/ArticleList.vue'),
        },
        {
          path: '/forum/:pBoardId/:boardId',
          name: "二级板块",
          component: () => import('@/views/forum/ArticleList.vue'),
        },
        {
          path: '/post/:articleId/',
          name: "文章详情",
          component: () => import('@/views/forum/ArticleDetail.vue'),
        },
        {
          path: '/newPost',
          name: "发布文章",
          component: () => import('@/views/forum/EditPost.vue'),
        }, {
          path: '/editPost/:articleId',
          name: "编辑文章",
          component: () => import('@/views/forum/EditPost.vue'),
        },
        {
          path: '/user/:userId',
          name: "用户信息",
          component: () => import('@/views/ucenter/Ucenter.vue'),
        },
        {
          path: '/user/message/:type',
          name: "消息",
          component: () => import('@/views/ucenter/MessageList.vue'),
        },
      ]
    }
  ]
})

export default router
