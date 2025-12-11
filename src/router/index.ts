import { createRouter, createWebHashHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";
import { useUser } from "@/composables/useUser";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    component: () => import("@/views/SignIn.vue"),
  },
  {
    path: "/speaking-mock",
    component: () => import("@/views/speaking-mock/full-test/index.vue"),
  },
  {
    path: "/speaking-mock/full-test/:id",
    component: () => import("@/views/speaking-mock/full-test/test.vue"),
  },
  {
    path: "/speaking-practice",
    component: () => import("@/views/speaking-practice/Practice.vue"),
  },
  {
    path: "/speaking-practice/part-1.1/:id",
    component: () => import("@/views/speaking-practice/part-1.1/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-1.1",
    component: () => import("@/views/speaking-practice/part-1.1/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-1.2/:id",
    component: () => import("@/views/speaking-practice/part-1.2/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-1.2",
    component: () => import("@/views/speaking-practice/part-1.2/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-2/:id",
    component: () => import("@/views/speaking-practice/part-2/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-2",
    component: () => import("@/views/speaking-practice/part-2/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-3/:id",
    component: () => import("@/views/speaking-practice/part-3/test.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/speaking-practice/part-3",
    component: () => import("@/views/speaking-practice/part-3/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/reports/:id",
    component: () => import("@/views/reports/ReportDetails.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        component: () => import("@/views/HomePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "reports",
        component: () => import("@/views/ReportsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        component: () => import("@/views/ProfilePage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
