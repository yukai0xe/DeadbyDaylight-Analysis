import { createRouter, createWebHistory } from "vue-router";
import firebase from "firebase/compat/app";
import "@/firebase";
import "firebase/compat/auth";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Authorization/Login.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Authorization/Register.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/characters',
    name: 'Characters',
    component: () => import('@/views/Character/Main.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true
    }
  },
  {
    path: '/wiki',
    name: 'DefaultWiki',
    component: () => import('@/views/Wiki/Perks.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/wiki/perks',
    name: 'Perks',
    component: () => import('@/views/Wiki/Perks.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/wiki/addOns',
    name: 'AddOns',
    component: () => import('@/views/Wiki/AddOns.vue'),
    meta: { layout: 'default' }
  },
  {
    path: '/other',
    name: 'Other',
    component: () => import('@/views/Other.vue'),
    meta: { layout: 'default' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) =>{
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if(!requiresAuth){
    next();
    return;
  }
  firebase.auth().onAuthStateChanged(user => {
    if(!user){
      next("/login");
      return;
    } 
    else{
      next();
      return;
    }
  });
});

export default router;
