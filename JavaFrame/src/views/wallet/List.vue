<template>
  <div class="wallet-list-container">
    <div class="page-header">
      <h2>我的钱包</h2>
      <el-button type="primary" @click="handleCreateWallet">
        <el-icon><Plus /></el-icon>
        创建钱包
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="wallet in wallets" :key="wallet.id">
        <el-card class="wallet-card" shadow="hover">
          <div class="wallet-icon" :style="{ background: getRandomGradient() }">
            <el-icon :size="24" color="white"><Wallet /></el-icon>
          </div>
          
          <div class="wallet-info">
            <h3>{{ wallet.name }}</h3>
            <p class="wallet-type">{{ wallet.type }}</p>
            
            <div class="wallet-balance">
              <span class="label">余额</span>
              <span class="amount">{{ wallet.balance }} {{ wallet.currency }}</span>
            </div>
            
            <div class="wallet-address">
              <span class="label">钱包地址</span>
              <div class="address-wrapper">
                <span class="address">{{ formatAddress(wallet.address) }}</span>
                <el-button 
                  type="primary" 
                  link 
                  @click="copyAddress(wallet.address)"
                >
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </div>
            </div>

            <div class="wallet-actions">
              <el-button-group>
                <el-button 
                  type="primary" 
                  plain
                  @click="handleTransfer(wallet)"
                >
                  转账
                </el-button>
                <el-button 
                  type="primary" 
                  plain
                  @click="handleReceive(wallet)"
                >
                  收款
                </el-button>
                <el-button 
                  type="primary" 
                  plain
                  @click="handleDetail(wallet)"
                >
                  详情
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态 -->
    <el-empty
      v-if="wallets.length === 0"
      description="暂无钱包"
    >
      <el-button type="primary" @click="handleCreateWallet">
        创建钱包
      </el-button>
    </el-empty>

    <!-- 转账对话框 -->
    <el-dialog
      v-model="transferDialogVisible"
      title="转账"
      width="500px"
    >
      <el-form
        :model="transferForm"
        :rules="transferRules"
        ref="transferFormRef"
        label-width="100px"
      >
        <el-form-item label="收款地址" prop="to">
          <el-input v-model="transferForm.to" placeholder="请输入收款地址" />
        </el-form-item>
        <el-form-item label="转账金额" prop="amount">
          <el-input-number 
            v-model="transferForm.amount" 
            :precision="6" 
            :step="0.000001" 
            :min="0"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="transferDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTransferSubmit" :loading="transferring">
            确认转账
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 收款对话框 -->
    <el-dialog
      v-model="receiveDialogVisible"
      title="收款"
      width="400px"
    >
      <div class="receive-content">
        <div class="qrcode-wrapper">
          <img :src="currentQRCode" alt="收款二维码" class="qrcode" v-if="currentQRCode">
        </div>
        <div class="address-info">
          <p class="label">钱包地址</p>
          <div class="address-wrapper">
            <span class="address">{{ currentWallet?.address }}</span>
            <el-button 
              type="primary" 
              link 
              @click="copyAddress(currentWallet?.address)"
            >
              <el-icon><DocumentCopy /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Wallet, DocumentCopy } from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import { useWalletStore } from '@/stores/wallet'

const router = useRouter()
const walletStore = useWalletStore()
const wallets = computed(() => walletStore.wallets)
const loading = ref(false)

// 转账相关
const transferDialogVisible = ref(false)
const transferFormRef = ref(null)
const transferring = ref(false)
const currentWallet = ref(null)
const transferForm = ref({
  to: '',
  amount: 0
})

const transferRules = {
  to: [
    { required: true, message: '请输入收款地址', trigger: 'blur' },
    { min: 42, max: 42, message: '请输入正确的钱包地址', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入转账金额', trigger: 'blur' },
    { type: 'number', min: 0.000001, message: '转账金额必须大于0', trigger: 'blur' }
  ]
}

// 收款相关
const receiveDialogVisible = ref(false)
const currentQRCode = ref('')

// 获取钱包列表
const fetchWallets = async () => {
  // 不需要额外的 API 调用，因为数据已经在 store 中了
  loading.value = false
}

// 创建钱包
const handleCreateWallet = () => {
  router.push('/wallet/create')
}

// 处理转账
const handleTransfer = (wallet) => {
  currentWallet.value = wallet
  transferForm.value = {
    to: '',
    amount: 0
  }
  transferDialogVisible.value = true
}

// 提交转账
const handleTransferSubmit = async () => {
  if (!transferFormRef.value) return
  
  try {
    await transferFormRef.value.validate()
    transferring.value = true
    
    // 这里调用转账 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('转账成功')
    transferDialogVisible.value = false
    fetchWallets() // 刷新钱包列表
  } catch (error) {
    console.error('转账失败:', error)
    ElMessage.error('转账失败，请重试')
  } finally {
    transferring.value = false
  }
}

// 处理收款
const handleReceive = async (wallet) => {
  currentWallet.value = wallet
  try {
    currentQRCode.value = await QRCode.toDataURL(wallet.address)
    receiveDialogVisible.value = true
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error('生成二维码失败')
  }
}

// 查看钱包详情
const handleDetail = (wallet) => {
  router.push(`/wallet/${wallet.id}`)
}

// 复制地址
const copyAddress = async (address) => {
  try {
    await navigator.clipboard.writeText(address)
    ElMessage.success('地址已复制')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

// 格式化地址显示
const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 生成随机渐变色
const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)',
    'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)'
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

onMounted(() => {
  fetchWallets()
})
</script>

<style scoped>
.wallet-list-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wallet-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}

.wallet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15) !important;
}

.wallet-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.3s;
}

.wallet-card:hover .wallet-icon {
  transform: scale(1.1);
}

.wallet-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.wallet-type {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
  font-weight: 500;
}

.wallet-balance {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
}

.wallet-balance .label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.wallet-balance .amount {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Roboto Mono', monospace;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wallet-address {
  padding: 12px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
}

.wallet-address .label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.address-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 6px;
}

.address {
  font-family: monospace;
  color: #2c3e50;
  font-size: 14px;
}

.wallet-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button-group .el-button) {
  margin-left: -1px;
  border-radius: 8px;
}

:deep(.el-button--primary.is-plain) {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: #6366f1;
}

:deep(.el-button--primary.is-plain:hover) {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.receive-content {
  text-align: center;
  padding: 20px;
}

.qrcode-wrapper {
  margin-bottom: 20px;
}

.qrcode {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .wallet-list-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px;
  }
  
  .wallet-actions {
    flex-direction: column;
  }
  
  :deep(.el-button-group) {
    display: flex;
    flex-direction: column;
  }
  
  :deep(.el-button-group .el-button) {
    margin-left: 0;
    margin-top: -1px;
  }
}
</style> 