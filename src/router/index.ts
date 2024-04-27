import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from '../components/pages/home/view/index.vue'
import LoginView from '../components/pages/login/view/index.vue'


const routes: Array<RouteRecordRaw> = [
  { path: '/',name:"root" ,component: LoginView },
  { path: '/home',name:"home", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
