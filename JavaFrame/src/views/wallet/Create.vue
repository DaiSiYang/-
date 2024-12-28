<template>
  <div class="create-wallet-container">
    <el-card class="create-wallet-card">
      <div class="card-header">
        <h2>创建新钱包</h2>
        <p class="subtitle">请填写以下信息创建您的新钱包</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="create-form"
      >
        <el-form-item label="钱包名称" prop="name">
          <el-input 
            v-model="form.name"
            placeholder="请输入钱包名称"
          />
          <div class="form-tip">给您的钱包起一个好记的名字</div>
        </el-form-item>

        <el-form-item label="钱包类型" prop="type">
          <el-select 
            v-model="form.type"
            placeholder="请选择钱包类型"
            class="type-select"
          >
            <el-option
              v-for="type in walletTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              <div class="type-option">
                <el-icon><component :is="type.icon" /></el-icon>
                <span>{{ type.label }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="form-tip">不同类型的钱包适用于不同的使用场景</div>
        </el-form-item>

        <el-form-item label="币种" prop="currency">
          <el-select 
            v-model="form.currency"
            placeholder="请选择币种"
            class="type-select"
          >
            <el-option label="ETH" value="ETH" />
            <el-option label="BTC" value="BTC" />
            <el-option label="USDT" value="USDT" />
          </el-select>
          <div class="form-tip">选择您要使用的加密货币类型</div>
        </el-form-item>

        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="creating"
          >
            创建钱包
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  WalletFilled,
  Shop,
  CreditCard
} from '@element-plus/icons-vue'
import { useWalletStore } from '@/stores/wallet'

const router = useRouter()
const walletStore = useWalletStore()
const formRef = ref(null)
const creating = ref(false)

const form = ref({
  name: '',
  type: '',
  currency: 'ETH'
})

const walletTypes = [
  { label: '主钱包', value: 'main', icon: 'WalletFilled' },
  { label: '交易钱包', value: 'trading', icon: 'Shop' },
  { label: '储蓄钱包', value: 'savings', icon: 'CreditCard' }
]

const rules = {
  name: [
    { required: true, message: '请输入钱包名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择钱包类型', trigger: 'change' }
  ],
  currency: [
    { required: true, message: '请选择币种', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    creating.value = true

    // 创建新钱包
    const newWallet = walletStore.createWallet({
      name: form.value.name,
      type: form.value.type,
      currency: form.value.currency
    })

    ElMessage.success('钱包创建成功')
    router.push('/wallet')
  } catch (error) {
    console.error('创建失败:', error)
    ElMessage.error('创建失败，请重试')
  } finally {
    creating.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.create-wallet-container {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.create-wallet-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  text-align: center;
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header h2 {
  margin: 16px 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.create-form {
  padding: 0 24px;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  padding-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  background: #fff;
  height: 44px;
}

:deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
}

.type-select {
  width: 100%;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.form-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

:deep(.el-button) {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 12px 24px;
  height: auto;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 640px) {
  .create-wallet-card {
    margin: 0 16px;
  }
  
  .create-form {
    padding: 0 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  :deep(.el-button) {
    width: 100%;
  }
}
</style> 