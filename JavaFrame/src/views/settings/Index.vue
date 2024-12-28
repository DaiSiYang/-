<template>
  <div class="settings-container">
    <div class="page-header">
      <h2>系统设置</h2>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 基本设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>基本设置</span>
            </div>
          </template>
          
          <el-form :model="basicSettings" label-width="100px">
            <el-form-item label="系统语言">
              <el-select v-model="basicSettings.language" style="width: 200px">
                <el-option label="简体中文" value="zh" />
                <el-option label="English" value="en" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="时区">
              <el-select v-model="basicSettings.timezone" style="width: 200px">
                <el-option label="(GMT+08:00) 北京" value="Asia/Shanghai" />
                <el-option label="(GMT+00:00) 伦敦" value="Europe/London" />
                <el-option label="(GMT-08:00) ���杉矶" value="America/Los_Angeles" />
              </el-select>
            </el-form-item>

            <el-form-item label="货币单位">
              <el-select v-model="basicSettings.currency" style="width: 200px">
                <el-option label="ETH" value="ETH" />
                <el-option label="BTC" value="BTC" />
                <el-option label="USDT" value="USDT" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 安全设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          
          <el-form :model="securitySettings" label-width="100px">
            <el-form-item label="登录验证">
              <el-switch
                v-model="securitySettings.twoFactorAuth"
                active-text="开启双重认证"
              />
            </el-form-item>

            <el-form-item label="交易确认">
              <el-switch
                v-model="securitySettings.transactionConfirm"
                active-text="转账需要确认"
              />
            </el-form-item>

            <el-form-item label="登录通知">
              <el-switch
                v-model="securitySettings.loginNotification"
                active-text="异地登录通知"
              />
            </el-form-item>

            <el-form-item label="修改密码">
              <el-button type="primary" @click="showChangePasswordDialog">
                修改登录密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 通知设置 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>通知设置</span>
            </div>
          </template>
          
          <el-form :model="notificationSettings" label-width="100px">
            <el-form-item label="系统通知">
              <el-switch
                v-model="notificationSettings.system"
                active-text="接收系统通知"
              />
            </el-form-item>

            <el-form-item label="交易通知">
              <el-switch
                v-model="notificationSettings.transaction"
                active-text="接收交易通知"
              />
            </el-form-item>

            <el-form-item label="价格提醒">
              <el-switch
                v-model="notificationSettings.priceAlert"
                active-text="接收价格提醒"
              />
            </el-form-item>

            <el-form-item label="通知方式">
              <el-checkbox-group v-model="notificationSettings.methods">
                <el-checkbox label="email">邮件</el-checkbox>
                <el-checkbox label="sms">短信</el-checkbox>
                <el-checkbox label="push">站内信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 账户信息 -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>账户信息</span>
            </div>
          </template>
          
          <div class="account-info">
            <el-avatar :size="64" :src="userInfo.avatar" />
            <h3>{{ userInfo.username }}</h3>
            <p>{{ userInfo.email }}</p>
            
            <div class="account-status">
              <el-tag type="success">已认证</el-tag>
              <el-tag type="warning" v-if="securitySettings.twoFactorAuth">双重认证已开启</el-tag>
            </div>

            <div class="account-actions">
              <el-button type="primary" plain @click="handleEditProfile">
                编辑资料
              </el-button>
              <el-button type="danger" plain @click="handleLogout">
                退出登录
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordVisible"
      title="修改密码"
      width="400px"
    >
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePasswordVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChangePassword">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editProfileVisible"
      title="编辑个人资料"
      width="500px"
    >
      <el-form
        :model="profileForm"
        :rules="profileRules"
        ref="profileFormRef"
        label-width="80px"
      >
        <el-form-item label="头像" class="avatar-upload">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-tip">点击上传头像</div>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editProfileVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateProfile" :loading="updating">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 基本设置
const basicSettings = ref({
  language: 'zh',
  timezone: 'Asia/Shanghai',
  currency: 'ETH'
})

// 安全设置
const securitySettings = ref({
  twoFactorAuth: false,
  transactionConfirm: true,
  loginNotification: true
})

// 通知设置
const notificationSettings = ref({
  system: true,
  transaction: true,
  priceAlert: false,
  methods: ['email', 'push']
})

// 用户信息
const userInfo = computed(() => ({
  username: userStore.username || '用户名',
  email: userStore.email || 'user@example.com',
  avatar: userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}))

// 修改密码相关
const changePasswordVisible = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 显示修改密码对话框
const showChangePasswordDialog = () => {
  changePasswordVisible.value = true
}

// 处理修改密码
const handleChangePassword = async () => {
  try {
    // 这里添加密码验证逻辑
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
    
    // 调用API修改密码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('密码修改成功')
    changePasswordVisible.value = false
    
    // 清空表单
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    ElMessage.error('密码修改失败')
  }
}

// 编辑资料相关
const editProfileVisible = ref(false)
const profileFormRef = ref(null)
const updating = ref(false)

const profileForm = ref({
  username: userStore.username,
  email: userStore.email,
  avatar: userStore.avatar
})

const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 处理编辑资料
const handleEditProfile = () => {
  profileForm.value = {
    username: userStore.username,
    email: userStore.email,
    avatar: userStore.avatar
  }
  editProfileVisible.value = true
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    // 这里使用 FileReader 来预览图片，实际项目中应该上传到服务器
    const reader = new FileReader()
    reader.onload = (e) => {
      profileForm.value.avatar = e.target.result
    }
    reader.readAsDataURL(options.file)
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
}

// 更新个人资料
const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    updating.value = true

    // 更新用户信息
    userStore.updateProfile({
      username: profileForm.value.username,
      email: profileForm.value.email,
      avatar: profileForm.value.avatar
    })

    ElMessage.success('个人资料更新成功')
    editProfileVisible.value = false
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败，请重试')
  } finally {
    updating.value = false
  }
}

// 退出登录
const handleLogout = async () => {
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
</script>

<style scoped>
.settings-container {
  padding: 24px;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.settings-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: none;
}

.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.account-info {
  text-align: center;
  padding: 20px;
}

.account-info h3 {
  margin: 16px 0 8px;
  font-size: 18px;
  color: #2c3e50;
}

.account-info p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.account-status {
  margin-bottom: 20px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.account-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .account-actions {
    flex-direction: column;
  }
  
  .account-actions .el-button {
    width: 100%;
  }
}

.avatar-upload {
  text-align: center;
}

.avatar-uploader {
  display: inline-block;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.avatar-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

:deep(.el-upload) {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

:deep(.el-form-item.avatar-upload .el-form-item__content) {
  justify-content: center;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style> 