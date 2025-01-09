<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue"
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue"
import Carousel from "./Carousel.vue"
import ArgonBadge from "@/components/ArgonBadge.vue"

const totalProfit = ref(0)
const totalCustomers = ref(0)
const totalRevenue = ref(0)
const threshold = ref(0)
const chartData = ref([])
const chartLabels = ref([])

// 獲取總利潤
const fetchProfit = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/wallet/profit`
    )
    if (response.data.rtnCode === "0000") {
      totalProfit.value = response.data.data.profit
    } else {
      console.error("無法獲取總利潤:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 獲取總客數
const fetchCustomer = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/reports/customers`
    )
    if (response.data.rtnCode === "0000") {
      totalCustomers.value = response.data.data.totalCustomers
    } else {
      console.error("無法獲取總:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 獲取總營業額
const fetchRevenue = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/reports/revenue`
    )
    if (response.data.rtnCode === "0000") {
      totalRevenue.value = response.data.data.totalRevenue
    } else {
      console.error("無法獲取總營業額:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 獲取連線門檻
const fetchThreshold = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/reports/threshold`
    )
    if (response.data.rtnCode === "0000") {
      threshold.value = response.data.data.threshold
    } else {
      console.error("無法獲取連線門檻:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

const fetchOrderReport = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/api/v1/admin/reports/orders`,
      {
        params: { year: new Date().getFullYear() },
      }
    )

    if (response.data.rtnCode === "0000") {
      chartLabels.value = response.data.data.map((item) => `${item.month} 月`)
      chartData.value = response.data.data.map((item) => item.totalSales)
    } else {
      console.error("無法獲取訂單報表:", response.data.rtnMsg)
    }
  } catch (error) {
    console.error("API 錯誤:", error)
  }
}

// 初始化時調用 API
onMounted(() => {
  fetchProfit()
  fetchCustomer()
  fetchRevenue()
  fetchThreshold()
  fetchOrderReport()
})
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="總客數"
              :value="`${Math.floor(totalCustomers.toFixed(2))}`"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="總營業額"
              :value="`$${Math.floor(totalRevenue.toFixed(2))}`"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="總利潤"
              :value="`$${Math.floor(totalProfit.toFixed(2))}`"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="連線次數"
              value="2"
              description="上次連線: <span
                class='text-sm font-weight-bolder text-success'
                >2025/01</span>"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="連線門檻"
              :value="`$${Math.floor(threshold.toFixed(2))}`"
              :icon="{
                component: 'ni ni-chart-bar-32',
                background: 'bg-gradient-info',
                shape: 'rounded-circle',
              }"
              :percentage="{
                value: Math.floor((threshold / 1500) * 100),
                color: 'success',
              }"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <router-link to="/products">
              <argon-badge :variant="'gradient'" :color="'primary'"
                >Products商品列表</argon-badge
              >
            </router-link>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <router-link to="/orders">
              <argon-badge :variant="'gradient'" :color="'info'"
                >Orders訂單列表</argon-badge
              >
            </router-link>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <router-link to="/billings">
              <argon-badge :variant="'gradient'" :color="'warning'"
                >Billings收支列表</argon-badge
              >
            </router-link>
          </div>
        </div>

        <div class="row"><br /></div>

        <div class="row">
          <div class="col-lg-7 mb-lg">
            <!-- line chart -->
            <!-- 動態生成的折線圖 -->
            <div class="card z-index-2">
              <gradient-line-chart
                v-if="chartLabels.length && chartData.length"
                id="chart-line"
                title="訂單銷售報表"
                description="
              <span class='font-weight-bold'>年度銷售統計</span>"
                :chart="{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: '銷售總額',
                      data: chartData,
                    },
                  ],
                }"
              />
            </div>
          </div>
          <div class="col-lg-5">
            <carousel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
