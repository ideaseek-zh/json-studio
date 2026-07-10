<template>
  <div
    v-if="matches"
    class="tree-node"
  >
    <button
      v-if="isContainer"
      class="tree-toggle"
      type="button"
      :title="expanded ? '折叠节点' : '展开节点'"
      @click="toggle(pathKey)"
    >
      {{ expanded ? '−' : '+' }}
    </button>
    <span
      v-else
      class="tree-spacer"
    ></span>

    <button
      type="button"
      class="tree-label"
      :title="`${label} · ${summary}`"
      @click="selectPath(path)"
    >
      <strong>{{ label }}</strong>
      <span class="tree-type">{{ summary }}</span>
    </button>

    <div
      v-if="expanded && isContainer"
      class="tree-children"
    >
      <JsonTreeNode
        v-for="child in children"
        :key="child.pathKey"
        :label="child.label"
        :value="child.value"
        :path="child.path"
        :path-key="child.pathKey"
        :expanded-map="expandedMap"
        :search-query="searchQuery"
        @toggle="toggle"
        @select-path="selectPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { JsonValue } from '@/utils/json';

const props = defineProps<{
  label: string;
  value: JsonValue;
  path: Array<string | number>;
  pathKey: string;
  expandedMap: Record<string, boolean>;
  searchQuery: string;
}>();

const emit = defineEmits<{
  toggle: [pathKey: string];
  selectPath: [path: Array<string | number>];
}>();

function toggle(pathKey: string) {
  emit('toggle', pathKey);
}

function selectPath(path: Array<string | number>) {
  emit('selectPath', path);
}

const isContainer = computed(() => typeof props.value === 'object' && props.value !== null);
const expanded = computed(() => props.expandedMap[props.pathKey] ?? props.path.length < 2);

const summary = computed(() => {
  if (Array.isArray(props.value)) {
    return `Array(${props.value.length})`;
  }
  if (props.value === null) {
    return 'null';
  }
  if (typeof props.value === 'object') {
    return `Object(${Object.keys(props.value).length})`;
  }
  return `${typeof props.value}: ${String(props.value)}`;
});

const children = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value.map((entry, index) => ({
      label: `[${index}]`,
      value: entry,
      path: [...props.path, index],
      pathKey: `${props.pathKey}.${index}`,
    }));
  }
  if (typeof props.value === 'object' && props.value !== null) {
    return Object.entries(props.value).map(([key, entry]) => ({
      label: key,
      value: entry,
      path: [...props.path, key],
      pathKey: `${props.pathKey}.${key}`,
    }));
  }
  return [];
});

function subtreeContains(value: JsonValue, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalized = query.toLowerCase();
  if (Array.isArray(value)) {
    return value.some((item) => subtreeContains(item, normalized));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).some(([key, item]) => key.toLowerCase().includes(normalized) || subtreeContains(item, normalized));
  }
  return String(value).toLowerCase().includes(normalized);
}

const matches = computed(() => {
  if (!props.searchQuery) {
    return true;
  }

  const normalized = props.searchQuery.toLowerCase();
  return props.label.toLowerCase().includes(normalized) || subtreeContains(props.value, normalized);
});
</script>
