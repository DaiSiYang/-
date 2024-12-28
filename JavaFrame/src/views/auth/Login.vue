<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <img src="@/image/ZONE.png" alt="Logo" class="logo">
        <h2>欢迎回来</h2>
        <p class="subtitle">请登录您的账号</p>
      </div>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="loginForm"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading"
            class="submit-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        还没有账号？
        <router-link to="/auth/register" class="register-link">
          立即注册
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Wallet } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = ref(null)
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginForm.value) return
  
  try {
    await loginForm.value.validate()
    loading.value = true
    
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', JSON.stringify({ username: form.value.username }))
    
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  animation: card-enter 0.5s ease;
}

.login-header {
  text-align: center;
  padding: 32px 24px 24px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  object-fit: contain;
}

.login-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  color: #718096;
  font-size: 14px;
}

.login-form {
  padding: 0 30px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #718096;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: none;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(102, 126, 234, 0.4);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-form-item__error) {
  padding-top: 4px;
  color: #e53e3e;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 