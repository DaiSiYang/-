<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <img src="@/image/ZONE.png" alt="Logo" class="logo">
        <h2>创建新账号</h2>
        <p class="subtitle">填写以下信息完成注册</p>
      </div>
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="registerForm"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="电子邮箱"
            :prefix-icon="Message"
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
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            :loading="loading"
            class="submit-btn"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register-footer">
        已有账号？
        <router-link to="/auth/login" class="login-link">
          立即登录
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message, Wallet } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import authApi from '@/api/auth'

const router = useRouter()
const registerForm = ref(null)
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerForm.value) return
  
  try {
    await registerForm.value.validate()
    loading.value = true
    
    // 调用注册 API
    await authApi.register(
      form.value.username,
      form.value.email,
      form.value.password
    )
    
    ElMessage.success('注册成功')
    router.push('/auth/login')
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error(error.response?.data?.message || '注册失败，请检查输入信息')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  animation: card-enter 0.5s ease;
}

.register-header {
  text-align: center;
  padding: 32px 24px 24px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  object-fit: contain;
}

.register-header h2 {
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

.register-form {
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

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #718096;
  font-size: 14px;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-link:hover {
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
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加表单项动画 */
:deep(.el-form-item) {
  animation: form-item-enter 0.6s ease-out backwards;
}

:deep(.el-form-item:nth-child(1)) {
  animation-delay: 0.1s;
}

:deep(.el-form-item:nth-child(2)) {
  animation-delay: 0.2s;
}

:deep(.el-form-item:nth-child(3)) {
  animation-delay: 0.3s;
}

:deep(.el-form-item:nth-child(4)) {
  animation-delay: 0.4s;
}

:deep(.submit-btn) {
  animation: form-item-enter 0.6s ease-out 0.5s backwards;
}

@keyframes form-item-enter {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 输入框焦点动画 */
:deep(.el-input__wrapper) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-input__wrapper:focus-within) {
  transform: scale(1.02);
}

/* 按钮动画效果 */
.submit-btn {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}
</style> 