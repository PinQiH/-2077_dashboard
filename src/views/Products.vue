<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Products table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Product
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Cost
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Price
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Created
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Updated
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <!-- 使用 v-for 來動態生成表格資料 -->
            <tr v-for="(product, index) in products" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <!-- 如果有圖片，就顯示 product.imageUrl，沒有就放預設 -->
                    <img
                      :src="product.image_urls[0] || '../assets/img/team-2.jpg'"
                      class="avatar avatar-sm me-3"
                      alt="product"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ product.name }}</h6>
                    <p class="text-xs text-secondary mb-0">
                      {{ product.description }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">
                  {{ Math.floor(product.cost_price) }}
                </p>
              </td>
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">
                  {{ Math.floor(product.price) }}
                </p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ product.createdAt.slice(0, 10) }}
                </span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ product.updatedAt.slice(0, 10) }}
                </span>
              </td>
              <td class="align-middle">
                <router-link
                  :to="`/products/${product.product_id}`"
                  class="text-secondary font-weight-bold text-xs"
                >
                  Edit
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
import ArgonPagination from "@/components/ArgonPagination.vue"
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue"

export default {
  name: "ProductsTable",
  components: {
    ArgonPagination,
    ArgonPaginationItem,
  },
  data() {
    return {
      products: [], // 用來存放 API 回傳的資料
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
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      // 這裡的 URL 換成你自己的後端 API 位址
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/v1/admin/products`, {
          params: {
            page: this.pagination.page,
            size: this.pagination.perPage,
          },
        })
        .then((response) => {
          this.products = response.data.data
          this.pagination = response.data.pagination
        })
        .catch((error) => {
          console.error("Error fetching products:", error)
        })
    },
    // 切換到特定頁碼
    goToPage(pageNumber) {
      // 1) 更新目前頁碼
      this.pagination.page = pageNumber
      // 2) 重新抓取資料
      this.fetchProducts()
    },
    // 上一頁
    goToPrevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--
        this.fetchProducts()
      }
    },
    // 下一頁
    goToNextPage() {
      if (this.pagination.page < this.pagination.totalPages) {
        this.pagination.page++
        this.fetchProducts()
      }
    },
  },
}
</script>
