import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Project1 from "@/views/menu/Project1View.vue";
import Project2 from "@/views/menu/Project2View.vue";
import Project3 from "@/views/menu/Project3View.vue";
import Project4 from "@/views/menu/Project4View.vue";
import About from "@/views/menu/AboutView.vue";
import PageNotFound from "@/views/service/PageNotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'project1',
    component: Project1,
  },
  {
    path: '/project2',
    name: 'project2',
    component: Project2,
  },
  {
    path: '/project3',
    name: 'project3',
    component: Project3,
  },
  {
    path: '/project4',
    name: 'project4',
    component: Project4,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/:catchAll(.*)',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const {BASE_URL} = process.env;
const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
});

export default router
