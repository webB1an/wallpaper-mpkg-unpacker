<script setup lang="ts">
const time = ref(getCurrentTime())

setInterval(() => {
  time.value = getCurrentTime()
}, 1000)

function getCurrentTime(): string {
  const now = new Date()
  const formatNumber = (num: number): string => String(num).padStart(2, '0')

  const year = now.getFullYear()
  const month = formatNumber(now.getMonth() + 1)
  const day = formatNumber(now.getDate())
  const hours = formatNumber(now.getHours())
  const minutes = formatNumber(now.getMinutes())
  const seconds = formatNumber(now.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center text-18px font-mono text-slate">
    <img class="animate-rotate mb-10px w-45px" src="/logo.svg" alt="">
    <HelloWorld msg="大风车吱呀吱哟哟地转~" />
    {{ time }}
  </div>
</template>

<style scoped>
.animate-rotate {
  animation: rotate-logo 2s linear infinite;
}
@keyframes rotate-logo {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
