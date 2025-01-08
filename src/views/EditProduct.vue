<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute() // 獲取路由對象
const product = ref({
  name: "",
  description: "",
  cost_price: 0,
  price: 0,
  stock: 0,
  image_urls: [""],
  product_url: "",
  Brand: {
    name: "",
  },
}) // 用於存放產品詳細信息
const loading = ref(false) // 儲存狀態

// 加載產品數據
const fetchProductDetails = async () => {
  try {
    const productId = route.params.productId // 獲取 URL 中的 productId
    const response = await axios.get(
      `https://2077-backend.onrender.com/api/v1/admin/products/${productId}`
    )

    if (response.data.rtnCode === "0000") {
      product.value = response.data.data // 將產品數據存入 product
      // 確保 Brand 存在
      if (!product.value.Brand) {
        product.value.Brand = { name: "" }
      }
      // 確保 image_urls 存在
      if (
        !product.value.image_urls ||
        !Array.isArray(product.value.image_urls)
      ) {
        product.value.image_urls = []
      }
    } else {
      console.error("無法獲取產品詳情:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 保存產品數據
const saveProductDetails = async () => {
  try {
    loading.value = true // 開始儲存
    const productId = route.params.productId // 獲取 productId
    const updateData = {
      name: product.value.name,
      costPrice: parseFloat(product.value.cost_price),
      price: parseFloat(product.value.price),
      description: product.value.description,
      stock: product.value.stock,
      imageUrls: product.value.image_urls,
      productUrl: product.value.product_url,
      brand: product.value.Brand?.name,
    }

    const response = await axios.put(
      `https://2077-backend.onrender.com/api/v1/admin/products/${productId}`,
      updateData
    )

    if (response.data.rtnCode === "0000") {
      alert("產品更新成功！")
    } else {
      console.error("無法更新產品:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  } finally {
    loading.value = false // 儲存完成
  }
}

// 添加新圖片 URL
const addImageUrl = () => {
  product.value.image_urls.push("")
}

// 刪除圖片 URL
const removeImageUrl = (index) => {
  product.value.image_urls.splice(index, 1)
}

onMounted(() => {
  fetchProductDetails()
})
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Edit Product</h6>
      <p class="text-sm mb-0">
        Edit the details of the product and save changes.
      </p>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <tbody v-if="product">
            <!-- 可編輯名稱 -->
            <tr>
              <th>Name</th>
              <td>
                <input
                  v-model="product.name"
                  type="text"
                  class="form-control"
                  placeholder="Enter product name"
                />
              </td>
            </tr>

            <!-- 可編輯描述 -->
            <tr>
              <th>Description</th>
              <td>
                <textarea
                  v-model="product.description"
                  class="form-control"
                  placeholder="Enter description"
                ></textarea>
              </td>
            </tr>

            <!-- 可編輯成本價 -->
            <tr>
              <th>Cost Price</th>
              <td>
                <input
                  v-model="product.cost_price"
                  type="number"
                  class="form-control"
                  placeholder="Enter cost price"
                />
              </td>
            </tr>

            <!-- 可編輯售價 -->
            <tr>
              <th>Selling Price</th>
              <td>
                <input
                  v-model="product.price"
                  type="number"
                  class="form-control"
                  placeholder="Enter selling price"
                />
              </td>
            </tr>

            <!-- 可編輯庫存 -->
            <tr>
              <th>Stock</th>
              <td>
                <input
                  v-model="product.stock"
                  type="number"
                  class="form-control"
                  placeholder="Enter stock quantity"
                />
              </td>
            </tr>

            <!-- 可編輯品牌 -->
            <tr>
              <th>Brand</th>
              <td>
                <input
                  v-model="product.Brand.name"
                  type="text"
                  class="form-control"
                  placeholder="Enter brand"
                />
              </td>
            </tr>

            <!-- 可編輯圖片 URL -->
            <tr>
              <th>Image URL</th>
              <td>
                <div
                  v-for="(url, index) in product.image_urls"
                  :key="index"
                  class="mb-3"
                >
                  <div class="d-flex align-items-center">
                    <!-- 圖片 URL 輸入框 -->
                    <input
                      v-model="product.image_urls[index]"
                      type="text"
                      class="form-control me-3"
                      placeholder="Enter image URL"
                    />
                    <!-- 預覽圖片 -->
                    <img
                      v-if="url"
                      :src="url"
                      alt="Preview"
                      class="img-thumbnail"
                      style="max-width: 100px; max-height: 100px"
                    />
                    <!-- 刪除按鈕 -->
                    <button
                      class="btn btn-danger ms-3"
                      @click="removeImageUrl(index)"
                    >
                      <i class="fas fa-minus-circle"></i>
                    </button>
                  </div>
                </div>
                <!-- 添加新圖片 URL 按鈕 -->
                <button class="btn btn-primary" @click="addImageUrl">
                  <i class="fas fa-plus"></i>
                </button>
              </td>
            </tr>

            <!-- 可編輯產品 URL -->
            <tr>
              <th>Product URL</th>
              <td>
                <input
                  v-model="product.product_url"
                  type="text"
                  class="form-control"
                  placeholder="Enter product URL"
                />
              </td>
            </tr>

            <!-- 保存按鈕 -->
            <tr>
              <td colspan="2" class="text-center">
                <router-link
                  :to="`/products`"
                  class="btn btn-success"
                  :disabled="loading"
                  @click="saveProductDetails"
                >
                  Save Changes
                </router-link>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" class="text-center">
                Loading product details...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
