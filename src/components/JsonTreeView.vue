<template>
  <section class="tree-panel">
    <div class="panel-heading compact-heading">
      <div>
        <h2>JSON树</h2>
      </div>
      <div class="tree-actions">
        <button
          class="btn"
          type="button"
          title="展开全部节点"
          @click="expandAll"
        >
          全部展开
        </button>
        <button
          class="btn"
          type="button"
          title="折叠全部节点"
          @click="collapseAll"
        >
          全部折叠
        </button>
      </div>
    </div>

    <input
      v-model="search"
      class="search-input"
      type="search"
      placeholder="搜索键名或值"
      title="搜索 JSON 键名或值"
    />

    <div
      v-if="value !== null"
      class="tree-root"
    >
      <JsonTreeNode
        label="$"
        :value="value"
        :path="[]"
        path-key="root"
        :expanded-map="expandedMap"
        :search-query="search"
        @toggle="toggle"
        @select-path="handleSelectPath"
      />
    </div>
    <p
      v-else
      class="empty-state"
    >
      当前没有可展示的 JSON 树，请先修复输入错误。
    </p>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import JsonTreeNode from './JsonTreeNode.vue';
import type { JsonValue } from '@/utils/json';

const props = defineProps<{
  value: JsonValue | null;
}>();

const emit = defineEmits<{
  selectPath: [path: Array<string | number>];
}>();

const search = ref('');
const expandedMap = reactive<Record<string, boolean>>({
  root: true,
});

function toggle(pathKey: string) {
  expandedMap[pathKey] = !(expandedMap[pathKey] ?? false);
}

function fillExpanded(value: JsonValue, pathKey: string) {
  expandedMap[pathKey] = true;
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        fillExpanded(item, `${pathKey}.${index}`);
      }
    });
    return;
  }
  if (value !== null && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (typeof item === 'object' && item !== null) {
        fillExpanded(item, `${pathKey}.${key}`);
      }
    });
  }
}

function expandAll() {
  if (props.value !== null) {
    fillExpanded(props.value, 'root');
  }
}

function collapseAll() {
  Object.keys(expandedMap).forEach((key) => delete expandedMap[key]);
  expandedMap.root = true;
}

function handleSelectPath(path: Array<string | number>) {
  emit('selectPath', path);
}
</script>
