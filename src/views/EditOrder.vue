<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute() // 獲取路由對象
const order = ref({
  order_by: "",
  order_date: "",
  total: "",
  status: "",
  notes: "",
  Frontend_user: {
    username: "",
    email: "",
  },
  OrderItems: [], // 存放訂單項目
}) // 用於存放訂單詳細信息
const loading = ref(false) // 儲存狀態
const statuses = ["待處理", "連線中", "準備出貨", "已出貨", "完成", "取消"] // 訂單狀態選項
const products = ref([]) // 用於存放可選商品
const selectedProduct = ref("") // 用於存放選擇的商品 ID
const selectedQuantity = ref(1) // 用於存放選擇的商品數量

// 加載訂單數據
const fetchOrderDetails = async () => {
  try {
    const orderId = route.params.orderId // 獲取 URL 中的 orderId
    const response = await axios.get(
      `https://2077-backend.onrender.com/api/v1/admin/orders/${orderId}`
    )

    if (response.data.rtnCode === "0000") {
      order.value = response.data.data // 將訂單數據存入 order
    } else {
      console.error("無法獲取訂單詳情:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 加載所有商品（用於選擇產品）
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      "https://2077-backend.onrender.com/api/v1/admin/products/all"
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

// 保存訂單數據
const saveOrderDetails = async () => {
  try {
    loading.value = true // 開始儲存
    const orderId = route.params.orderId // 獲取 orderId
    const updateData = {
      status: order.value.status,
      notes: order.value.notes,
      items: order.value.OrderItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
    }

    const response = await axios.put(
      `https://2077-backend.onrender.com/api/v1/admin/orders/${orderId}`,
      updateData
    )

    if (response.data.rtnCode === "0000") {
      alert("訂單更新成功！")
    } else {
      console.error("無法更新訂單:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  } finally {
    loading.value = false // 儲存完成
  }
}

// 添加新商品到 OrderItems
const addOrderItem = () => {
  const product = products.value.find(
    (p) => p.product_id === selectedProduct.value
  )
  if (product && selectedQuantity.value > 0) {
    order.value.OrderItems.push({
      product_id: product.product_id,
      quantity: selectedQuantity.value,
      price: product.price,
      Product: product,
    })

    // 重置選擇框
    selectedProduct.value = ""
    selectedQuantity.value = 1
  } else {
    alert("請選擇一個商品並輸入有效數量")
  }
}

// 刪除商品
const removeOrderItem = (index) => {
  order.value.OrderItems.splice(index, 1)
}

// 初始化時加載數據
onMounted(() => {
  fetchOrderDetails()
  fetchProducts()
})
</script>
<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Edit Order</h6>
      <p class="text-sm mb-0">
        View and edit the details of the order. Only order items are editable.
      </p>
    </div>
    <div class="card-body px-0 pb-2">
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <tbody v-if="order">
            <!-- 顯示不可編輯的基本信息 -->
            <tr>
              <th>Order By</th>
              <td>{{ order.Frontend_user.username }}</td>
            </tr>
            <tr>
              <th>Order Date</th>
              <td>{{ order.order_date.slice(0, 10) }}</td>
            </tr>
            <tr>
              <th>Total</th>
              <td>${{ order.total }}</td>
            </tr>

            <!-- 可編輯狀態 -->
            <tr>
              <th>Status</th>
              <td>
                <select v-model="order.status" class="form-control">
                  <option
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>
            </tr>

            <!-- 可編輯備註 -->
            <tr>
              <th>Notes</th>
              <td>
                <textarea
                  v-model="order.notes"
                  class="form-control"
                  placeholder="Enter notes"
                ></textarea>
              </td>
            </tr>

            <!-- 訂單項目 -->
            <tr>
              <th colspan="2">Order Items</th>
            </tr>
            <tr v-for="item in order.OrderItems" :key="item.item_id">
              <td>
                <div class="d-flex align-items-center">
                  <!-- 商品名稱 -->
                  <div class="me-3">
                    <img
                      :src="item.Product.image_urls[0]"
                      alt="Product"
                      class="img-thumbnail"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                  <div>
                    <h6 class="mb-0">{{ item.Product.name }}</h6>
                    <small>Price: ${{ item.price }}</small>
                  </div>
                </div>
              </td>
              <td>
                <!-- 編輯數量 -->
                <input
                  v-model="item.quantity"
                  type="number"
                  class="form-control"
                  placeholder="Quantity"
                />
              </td>
              <td>
                <!-- 商品總價 -->
                <p class="text-sm">
                  $
                  {{ item.price * item.quantity }}
                </p>
              </td>
              <td>
                <!-- 刪除商品 -->
                <button class="btn btn-danger" @click="removeOrderItem(index)">
                  Remove
                </button>
              </td>
            </tr>

            <!--新增項目-->
            <tr>
              <th>Add New Item</th>
              <td>
                <select v-model="selectedProduct" class="form-control">
                  <option value="" disabled>Select a product</option>
                  <option
                    v-for="product in products"
                    :key="product.product_id"
                    :value="product.product_id"
                  >
                    {{ product.name }}
                  </option>
                </select>
              </td>
              <td>
                <input
                  v-model="selectedQuantity"
                  type="number"
                  class="form-control"
                  placeholder="Quantity"
                />
              </td>
              <td>
                <button class="btn btn-primary" @click="addOrderItem">
                  Add Item
                </button>
              </td>
            </tr>

            <!-- 保存按鈕 -->
            <tr>
              <td colspan="2" class="text-center">
                <router-link
                  :to="`/orders`"
                  class="btn btn-success"
                  :disabled="loading"
                  @click="saveOrderDetails"
                >
                  Save Changes
                </router-link>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" class="text-center">Loading order details...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
