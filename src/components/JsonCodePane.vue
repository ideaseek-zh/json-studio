<template>
  <div class="code-panel-shell">
    <div
      ref="scrollRef"
      class="code-scroll"
      @scroll="syncScroll"
    >
      <div class="code-gutter">
        <div
          ref="gutterInnerRef"
          class="code-gutter-inner"
        >
          <span
            v-for="line in lineNumbers"
            :key="line"
            class="code-line-number"
          >
            {{ line }}
          </span>
        </div>
      </div>

      <div class="code-content">
        <pre
          ref="highlightRef"
          class="code-highlight"
          aria-hidden="true"
          v-html="highlightedHtml"
        ></pre>

        <textarea
          v-if="editable"
          :value="modelValue"
          class="code-input"
          spellcheck="false"
          @input="handleInput"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { highlightJsonHtml } from '@/utils/json';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    editable?: boolean;
  }>(),
  {
    editable: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const scrollRef = ref<HTMLDivElement | null>(null);
const highlightRef = ref<HTMLElement | null>(null);
const gutterInnerRef = ref<HTMLElement | null>(null);

const lineNumbers = computed(() => {
  const count = props.modelValue ? props.modelValue.split('\n').length : 1;
  return Array.from({ length: count }, (_, index) => index + 1);
});

const highlightedHtml = computed(() => {
  const normalized = props.modelValue || ' ';
  return highlightJsonHtml(normalized);
});

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}

function syncScroll() {
  const scrollTop = scrollRef.value?.scrollTop ?? 0;
  const scrollLeft = scrollRef.value?.scrollLeft ?? 0;

  if (highlightRef.value) {
    highlightRef.value.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
  }
  if (gutterInnerRef.value) {
    gutterInnerRef.value.style.transform = `translateY(${-scrollTop}px)`;
  }
}
</script>
