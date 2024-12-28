<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon><Monitor /></el-icon>
      <span>仪表盘</span>
    </el-menu-item>
    <el-menu-item index="/wallet/create">
      <el-icon><Wallet /></el-icon>
      <span>钱包管理</span>
    </el-menu-item>
    <el-menu-item index="/transactions">
      <el-icon><List /></el-icon>
      <span>交易记录</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Monitor, Wallet, List } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  border-right: none;
}
</style> 