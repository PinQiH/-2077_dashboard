<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const products = ref([]) // 用於存放可選商品
const isWhiteText = ref(true) // 控制文字顏色的狀態

// 切換文字顏色
const toggleTextColor = () => {
  isWhiteText.value = !isWhiteText.value
}

// 加載所有商品
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/products`
    )

    if (response.data.rtnCode === "0000") {
      products.value = response.data.data // 將商品數據存入 products
    } else {
      console.error("無法獲取商品列表:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 初始化時加載數據
onMounted(() => {
  fetchProducts()
})
</script>
<template>
  <div class="card card-carousel overflow-hidden h-100 p-0">
    <div
      id="carouselExampleCaptions"
      class="carousel slide h-100"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner border-radius-lg h-100">
        <!-- 動態生成 Carousel 項目 -->
        <div
          v-for="(product, index) in products"
          :key="product.product_id"
          class="carousel-item h-100"
          :class="{ active: index === 0 }"
          :style="{
            backgroundImage: `url(${product.image_urls[0] || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        >
          <div
            class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5"
          >
            <div
              class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3"
              style="width: 30px; height: 30px"
            >
              <button class="btn p-0 m-0" @click="toggleTextColor">
                <i class="fas fa-exchange-alt text-dark opacity-10"></i>
              </button>
            </div>
            <h5 :class="isWhiteText ? 'text-white' : 'text-dark'" class="mb-1">
              {{ product.name }}
            </h5>
            <p :class="isWhiteText ? 'text-white' : 'text-dark'">
              {{ product.description }}
            </p>
            <a
              v-if="product.product_url"
              :href="`/products/${product.product_id}`"
              class="btn btn-sm btn-light text-dark"
              >View Product</a
            >
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev w-5 me-3"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next w-5 me-3"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>
