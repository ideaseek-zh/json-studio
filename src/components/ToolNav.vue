<template>
  <nav class="tool-nav">
    <RouterLink
      v-for="tool in tools"
      :key="tool.to"
      :to="tool.to"
      class="tool-link"
      :class="{ active: currentPath === tool.to }"
    >
      {{ tool.label }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentPath: string;
  tools: Array<{ to: string; label: string }>;
}>();
</script>
