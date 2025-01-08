<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Orders table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                OrderBy
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                OrderDate
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Total
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Status
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Notes
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <!-- 使用 v-for 來動態生成表格資料 -->
            <tr v-for="(order, index) in orders" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ order.order_by }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">
                  {{ order.order_date.slice(0, 10) }}
                </p>
              </td>
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">
                  {{ Math.floor(order.total) }}
                </p>
              </td>
              <td class="align-middle text-center">
                <argon-badge
                  :variant="'gradient'"
                  :color="getStatusColor(order.status)"
                >
                  {{ order.status }}
                </argon-badge>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ order.notes }}
                </span>
              </td>
              <td class="align-middle">
                <router-link
                  :to="`/orders/${order.order_id}`"
                  class="btn btn-link text-secondary mb-0"
                >
                  <i class="fa fa-ellipsis-v text-xs" aria-hidden="true"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分頁组件區 -->
    <argon-pagination class="my-3 d-flex justify-content-center">
      <!-- 上一頁 -->
      <argon-pagination-item
        prev
        :disabled="pagination.page === 1"
        @click="goToPrevPage"
      />

      <!-- 分頁按鈕 -->
      <argon-pagination-item
        v-for="p in pagination.totalPages"
        :key="p"
        :label="p"
        :active="p === pagination.page"
        @click="goToPage(p)"
      />

      <!-- 下一頁 -->
      <argon-pagination-item
        next
        :disabled="pagination.page === pagination.totalPages"
        @click="goToNextPage"
      />
    </argon-pagination>
  </div>
</template>

<script>
import axios from "axios"
import ArgonBadge from "@/components/ArgonBadge.vue"
import ArgonPagination from "@/components/ArgonPagination.vue"
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue"

export default {
  name: "OrdersTable",
  components: {
    ArgonBadge,
    ArgonPagination,
    ArgonPaginationItem,
  },
  data() {
    return {
      orders: [], // 用來存放 API 回傳的資料
      pagination: {
        page: 1, // 目前頁碼
        perPage: 10, // 每頁幾筆
        totalPages: 1, // 總頁數
        totalCount: 0, // 總筆數
      },
    }
  },
  created() {
    // 一旦元件被建立，就去抓取資料
    this.fetchOrders()
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "待處理":
          return "secondary" // 灰色 (預設)
        case "連線中":
          return "info" // 藍色
        case "準備出貨":
          return "primary" // 深藍色
        case "已出貨":
          return "success" // 綠色
        case "完成":
          return "dark" // 深色
        case "取消":
          return "danger" // 紅色
        default:
          return "warning" // 黃色
      }
    },
    fetchOrders() {
      // 這裡的 URL 換成你自己的後端 API 位址
      axios
        .get("https://2077-backend.onrender.com/api/v1/admin/orders", {
          params: {
            page: this.pagination.page,
            size: this.pagination.perPage,
          },
        })
        .then((response) => {
          this.orders = response.data.data
          this.pagination = response.data.pagination
        })
        .catch((error) => {
          console.error("Error fetching orders:", error)
        })
    },
    // 切換到特定頁碼
    goToPage(pageNumber) {
      // 1) 更新目前頁碼
      this.pagination.page = pageNumber
      // 2) 重新抓取資料
      this.fetchOrders()
    },
    // 上一頁
    goToPrevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--
        this.fetchOrders()
      }
    },
    // 下一頁
    goToNextPage() {
      if (this.pagination.page < this.pagination.totalPages) {
        this.pagination.page++
        this.fetchOrders()
      }
    },
  },
}
</script>
