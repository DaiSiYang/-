<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <img src="@/image/ZONE.png" alt="Logo">
        <span>区块链钱包</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="menu"
        router
        :collapse="isCollapse"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <el-menu-item index="/wallet">
          <el-icon><WalletFilled /></el-icon>
          <span>钱包管理</span>
        </el-menu-item>

        <el-menu-item index="/transactions">
          <el-icon><Money /></el-icon>
          <span>交易记录</span>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapse"
          >
            <el-icon :size="20">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">{{ username }}</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  Monitor,
  WalletFilled,
  Money,
  Setting,
  Expand,
  Fold,
  CaretBottom,
  SwitchButton
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 用户信息
const username = computed(() => userStore.username || '用户')
const userAvatar = computed(() => userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  if (command === 'settings') {
    router.push('/settings')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      userStore.clearUserInfo()
      router.push('/auth/login')
    } catch {
      // 用户取消操作
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.aside {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo img {
  height: 32px;
  margin-right: 8px;
}

.menu {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #2c3e50;
  margin: 4px 0;
}

:deep(.el-menu-item:hover) {
  background: rgba(102, 126, 234, 0.1);
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  color: #667eea;
  font-weight: 600;
  border-right: 3px solid #667eea;
}

.header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.1);
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.main {
  padding: 20px;
  background: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .aside {
    position: fixed;
    z-index: 1000;
    height: 100vh;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  .aside.collapsed {
    transform: translateX(-200px);
  }

  .main {
    padding: 16px;
  }
}
</style> 