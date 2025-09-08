import { createRouter, createWebHistory } from "@ionic/vue-router";
import Tabs from "@/components/Tabs.vue";
import { useUser } from "@/composables/useUser";

const routes = [
  {
    path: "/speaking/full-test/:id",
    component: () => import("@/views/speaking/full-test/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/full-test",
    component: () => import("@/views/speaking/full-test/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-1.1/:id",
    component: () => import("@/views/speaking/part-1.1/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-1.1",
    component: () => import("@/views/speaking/part-1.1/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-1.2/:id",
    component: () => import("@/views/speaking/part-1.2/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-1.2",
    component: () => import("@/views/speaking/part-1.2/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-2/:id",
    component: () => import("@/views/speaking/part-2/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-2",
    component: () => import("@/views/speaking/part-2/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-3/:id",
    component: () => import("@/views/speaking/part-3/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking/part-3",
    component: () => import("@/views/speaking/part-3/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/SignIn.vue"),
  },
  {
    path: "/settings",
    component: () => import("@/views/Settings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payment",
    component: () => import("@/views/Payment.vue"),
  },
  {
    path: "/update-profile",
    component: () => import("@/views/UpdateProfile.vue"),
  },
  {
    path: "/videos/:id",
    component: () => import("@/views/video-practice/SingleVideo.vue"),
  },
  {
    path: "/",
    name: "Home",
    redirect: "/home",
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    component: Tabs,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "videos",
        name: "Videos",
        component: () => import("@/views/video-practice/AllVideos.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/result",
        name: "Report",
        component: () => import("@/views/Report.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/Profile.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, loadUser } = useUser();

  // Load user data to check authentication status
  await loadUser();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated.value) {
    next("/login"); // Redirect to login if authentication is required and user is not logged in
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
