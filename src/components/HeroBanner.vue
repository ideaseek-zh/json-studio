<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">隐私优先 JSON 工具</p>
      <h1>JSON Studio</h1>
      <p class="hero-text">
        在浏览器中完成 JSON 的格式化、可视化、校验和转换。
        不上传、不追踪、不依赖云端。
      </p>
      <div class="hero-pills">
        <span>100% 浏览器处理</span>
        <span>支持离线使用</span>
        <span>纯前端实现</span>
      </div>
    </div>
    <div class="hero-card">
      <h2>{{ currentLabel }}</h2>
      <p>当前这版先把最核心的工作流落地，后续可以继续扩成图谱、对比、Schema 和多语言代码生成。</p>
      <ul>
        <li>格式化 / 压缩</li>
        <li>JSON 格式校验</li>
        <li>树结构浏览</li>
        <li>类型定义生成</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  currentLabel: string;
}>();
</script>
