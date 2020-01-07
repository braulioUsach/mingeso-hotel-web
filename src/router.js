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
      component: () => import("./views/booking/List.vue")
    },
    {
      path: "/clients/create",
      name: "create-client",
      component: () => import("./views/client/Create.vue")
    },
    {
      path: "/booking/create",
      name: "create-booking",
      component: () => import("./views/booking/Create.vue")
    },
    {
      path: "/checkin/create",
      name: "create-checkin",
      component: () => import("./views/checkin/Create.vue")
    },
    {
      path: "/services/new",
      name: "add-service",
      component: () => import("./views/services/New.vue")
    },
    {
      path: "/checkout/create",
      name: "create-checkout",
      component: () => import("./views/checkout/Create.vue")
    }
  ]
});
