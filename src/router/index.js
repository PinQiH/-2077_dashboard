import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import Products from "../views/Products.vue"
import EditProduct from "../views/EditProduct.vue"
import EditOrder from "../views/EditOrder.vue"
import Orders from "../views/Orders.vue"
import Tables from "../views/Tables.vue"
import Billing from "../views/Billing.vue"
import VirtualReality from "../views/VirtualReality.vue"
import RTL from "../views/Rtl.vue"
import Profile from "../views/Profile.vue"
import Signup from "../views/Signup.vue"
import Signin from "../views/Signin.vue"

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/products/:productId",
    name: "EditProduct",
    component: EditProduct,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
  },
  {
    path: "/orders/:orderId",
    name: "EditOrders",
    component: EditOrder,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
})

export default router
