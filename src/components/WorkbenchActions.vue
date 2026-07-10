<template>
  <section class="panel action-panel">
    <div class="action-row">
      <button
        class="btn btn-primary"
        type="button"
        title="格式化 JSON 内容"
        @click="$emit('pretty')"
      >
        格式化
      </button>
      <button
        class="btn"
        type="button"
        title="压缩 JSON 内容"
        @click="$emit('minify')"
      >
        压缩
      </button>
      <button
        class="btn"
        type="button"
        title="校验 JSON 格式"
        @click="$emit('validate')"
      >
        校验
      </button>
      <button
        class="btn"
        type="button"
        title="加载示例 JSON"
        @click="$emit('sample')"
      >
        加载示例
      </button>
      <span class="action-note">本地处理</span>
    </div>

    <div class="toggle-row">
      <label class="toggle">
        <input
          type="checkbox"
          :checked="sortKeys"
          title="按键名字母顺序排序"
          @change="$emit('toggle', 'sortKeys')"
        />
        <span>键名排序</span>
      </label>
      <label class="toggle">
        <input
          type="checkbox"
          :checked="removeNulls"
          title="移除值为 Null 的字段"
          @change="$emit('toggle', 'removeNulls')"
        />
        <span>移除 Null</span>
      </label>
      <label class="toggle">
        <input
          type="checkbox"
          :checked="removeEmpty"
          title="移除空对象、空数组和空字符串"
          @change="$emit('toggle', 'removeEmpty')"
        />
        <span>移除空值</span>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  sortKeys: boolean;
  removeNulls: boolean;
  removeEmpty: boolean;
}>();

defineEmits<{
  pretty: [];
  minify: [];
  validate: [];
  sample: [];
  toggle: [option: 'sortKeys' | 'removeNulls' | 'removeEmpty'];
}>();
</script>
