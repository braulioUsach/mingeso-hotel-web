import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      // component: Home
      component: () => import("./views/postulant/Index.vue")
    },
    {
      path: "/postulant",
      name: "index-postulant",
      component: () => import("./views/postulant/Index.vue")
    },
    {
      path: "/postulant/create",
      name: "create-postulant",
      component: () => import("./views/postulant/Edit.vue")
    },
    {
      path: "/client/create",
      name: "create-client",
      component: () => import("./views/client/Create.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
