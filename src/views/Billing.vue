<script setup>
// import MasterCard from "@/examples/Cards/MasterCard.vue"
// import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue"
// import PaymentCard from "./components/PaymentCard.vue"
// import InvoiceCard from "./components/InvoiceCard.vue"
// import BillingCard from "./components/BillingCard.vue"
// import TransactionCard from "./components/TransactionCard.vue"
import { ref, onMounted } from "vue"
import axios from "axios"
import ArgonInput from "@/components/ArgonInput.vue"
import ArgonRadio from "@/components/ArgonRadio.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import ArgonPagination from "@/components/ArgonPagination.vue"
import ArgonPaginationItem from "@/components/ArgonPaginationItem.vue"

// 定義交易記錄的狀態
const transactions = ref([])
const pagination = ref({
  page: 1, // 當前頁碼
  perPage: 5, // 每頁幾筆
  totalPages: 1, // 總頁數
  totalCount: 0, // 總筆數
})
const totalProfit = ref(0)

// 新增交易的狀態
const newTransaction = ref({
  type: "IN",
  amount: "",
  description: "",
})

// 請求 API 獲取交易記錄
const fetchTransactions = async () => {
  try {
    const response = await axios.get(
      "https://2077-backend.onrender.com/api/v1/admin/wallet",
      {
        params: {
          page: pagination.value.page,
          size: pagination.value.perPage,
        },
      }
    )
    if (response.data.rtnCode === "0000") {
      transactions.value = response.data.data
      pagination.value = response.data.pagination
    } else {
      console.error("無法獲取交易記錄:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 獲取結算利潤
const fetchProfit = async () => {
  try {
    const response = await axios.get(
      "https://2077-backend.onrender.com/api/v1/admin/wallet/profit"
    )
    if (response.data.rtnCode === "0000") {
      totalProfit.value = response.data.data.profit
    } else {
      console.error("無法獲取結算利潤:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 新增交易邏輯
const addTransaction = async () => {
  try {
    const response = await axios.post(
      "https://2077-backend.onrender.com/api/v1/admin/wallet",
      newTransaction.value
    )
    if (response.data.rtnCode === "0000") {
      // closeAddTransactionModal()
      fetchTransactions()
      fetchProfit()
    } else {
      console.error("無法新增交易:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 刪除交易
const deleteTransaction = async (transactionId) => {
  try {
    const response = await axios.delete(
      `https://2077-backend.onrender.com/api/v1/admin/wallet/${transactionId}`
    )
    if (response.data.rtnCode === "0000") {
      // 刪除成功後重新加載交易記錄和總利潤
      fetchTransactions()
      fetchProfit()
    } else {
      console.error("無法刪除交易:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 分頁控制邏輯
const goToPage = (pageNumber) => {
  pagination.value.page = pageNumber
  fetchTransactions()
}
const goToPrevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchTransactions()
  }
}
const goToNextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    fetchTransactions()
  }
}

// 初始化時調用 API
onMounted(() => {
  fetchTransactions()
  fetchProfit()
})
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-7 mb-lg">
        <div class="card h-100 mb-4">
          <div class="card-header pb-0 px-3">
            <div class="row">
              <div class="col-md-6">
                <h6 class="mb-0">My Transactions</h6>
              </div>
              <div
                class="col-md-6 d-flex justify-content-end align-items-center"
              >
                <i class="fas fa-wallet me-2" aria-hidden="true"></i>
                <small
                  :class="totalProfit > 0 ? 'text-success' : 'text-danger'"
                >
                  ${{ totalProfit.toFixed(2) }}
                </small>
              </div>
            </div>
          </div>
          <div class="card-body pt-4 p-3">
            <ul class="list-group">
              <li
                v-for="transaction in transactions"
                :key="transaction.transaction_id"
                class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
              >
                <div class="d-flex align-items-center">
                  <argon-button
                    :color="transaction.type === 'IN' ? 'success' : 'danger'"
                    variant="outline"
                    size="sm"
                    class="btn-icon-only btn-rounded mb-0 me-3 d-flex align-items-center justify-content-center"
                  >
                    <i
                      :class="
                        transaction.type === 'IN'
                          ? 'fas fa-arrow-up'
                          : 'fas fa-arrow-down'
                      "
                      aria-hidden="true"
                    ></i>
                  </argon-button>
                  <div class="d-flex flex-column">
                    <h6 class="mb-1 text-dark text-sm">
                      {{ transaction.description }}
                    </h6>
                    <span class="text-xs">
                      {{ new Date(transaction.createdAt).toLocaleString() }}
                    </span>
                  </div>
                </div>
                <div
                  :class="[
                    'd-flex align-items-center text-sm font-weight-bold',
                    transaction.type === 'IN'
                      ? 'text-success text-gradient'
                      : 'text-danger text-gradient',
                  ]"
                >
                  {{ transaction.type === "IN" ? "+" : "-" }} ${{
                    transaction.amount
                  }}
                  <div>
                    <button
                      class="btn btn-link text-secondary mb-0"
                      aria-haspopup="true"
                      aria-expanded="false"
                      @click="deleteTransaction(transaction.transaction_id)"
                    >
                      <i
                        class="fas fa-trash-alt text-xs"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <!-- 分頁功能 -->
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
        </div>
      </div>
      <!-- 新增交易的對話框 -->
      <div class="col-lg-5">
        <div class="card h-100 mb-4">
          <div class="card-header pb-0 px-3">
            <div class="row">
              <div class="col-md-6">
                <h6 class="mb-0">
                  <i class="fas fa-plus me-2"></i>Add Transaction
                </h6>
              </div>
            </div>
          </div>
          <div class="card-body">
            <form role="form" @submit.prevent="addTransaction">
              <div class="d-flex">
                <!-- Income Radio -->
                <argon-radio
                  id="income"
                  name="transactionType"
                  :checked="newTransaction.type === 'IN'"
                  @change="newTransaction.type = 'IN'"
                  class="ms-4"
                >
                  IN
                </argon-radio>

                <!-- Expense Radio -->
                <argon-radio
                  id="expense"
                  name="transactionType"
                  :checked="newTransaction.type === 'OUT'"
                  @change="newTransaction.type = 'OUT'"
                  class="ms-4"
                >
                  OUT
                </argon-radio>
              </div>
              <argon-input
                id="amount"
                v-model="newTransaction.amount"
                type="number"
                placeholder="Enter amount"
                aria-label="Amount"
              />
              <argon-input
                id="description"
                v-model="newTransaction.description"
                type="text"
                placeholder="Enter description"
                aria-label="Description"
              />
              <div class="text-center">
                <argon-button
                  fullWidth
                  color="success"
                  variant="gradient"
                  class="my-4 mb-2"
                >
                  Add Transaction
                </argon-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
