<template>
  <div class="auth-layout">
    <div class="particles">
      <div v-for="n in 50" :key="n" class="particle"></div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// 在组件加载时为每个粒子设置随机位置和延迟
import { onMounted } from 'vue'

onMounted(() => {
  const particles = document.querySelectorAll('.particle')
  particles.forEach(particle => {
    const randomTop = Math.random() * 100
    const randomLeft = Math.random() * 100
    const randomDelay = Math.random() * 5

    particle.style.top = `${randomTop}vh`
    particle.style.left = `${randomLeft}vw`
    particle.style.animationDelay = `${randomDelay}s`
  })
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.particle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  animation: pulse 2s ease-in-out infinite;
}

/* 三种不同大小的粒子 */
.particle:nth-child(3n) {
  width: 2px;
  height: 2px;
  animation: floating 6s linear infinite;
}

.particle:nth-child(3n + 1) {
  width: 3px;
  height: 3px;
  animation: floating 8s linear infinite;
}

.particle:nth-child(3n + 2) {
  width: 4px;
  height: 4px;
  animation: floating 10s linear infinite;
}

@keyframes floating {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, 10px) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* 路由过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
