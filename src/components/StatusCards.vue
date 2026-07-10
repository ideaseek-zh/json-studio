<template>
  <section class="status-grid">
    <article class="panel status-card">
      <div class="status-top">
        <span class="status-dot" :class="validation.valid ? 'good' : 'bad'"></span>
        <h3>{{ validation.valid ? 'JSON有效' : 'JSON无效' }}</h3>
      </div>
      <p>{{ validation.message }}</p>
      <p v-if="!validation.valid && validation.line && validation.column" class="status-meta">
        第 {{ validation.line }} 行，第 {{ validation.column }} 列
      </p>
    </article>

    <article class="panel status-card">
      <h3>最近路径</h3>
      <p>{{ lastPath }}</p>
      <p class="status-meta">点击树节点后会生成可复制的 JSONPath 风格路径。</p>
    </article>

    <article class="panel status-card">
      <h3>SEO 路由</h3>
      <p>{{ routeCount }} 个路由已预留</p>
      <p class="status-meta">后续扩展 diff、schema、graph 时可以直接接入独立页面。</p>
    </article>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  validation: {
    valid: boolean;
    message: string;
    line?: number;
    column?: number;
  };
  lastPath: string;
  routeCount: number;
}>();
</script>
