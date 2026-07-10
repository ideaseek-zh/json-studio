import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import {
  copyableJsonPath,
  formatJson,
  generateTypeScriptDefinitions,
  parseJsonInput,
  SAMPLE_JSON,
  type JsonValue,
} from '@/utils/json';

export type OutputTab = 'formatted' | 'tree' | 'typescript';

interface ValidationState {
  valid: boolean;
  message: string;
  line?: number;
  column?: number;
}

const STORAGE_KEY = 'json-studio:draft';
const LEGACY_SAMPLE_JSONS = [
  `{
  "app": "JSON Studio",
  "privacy": {
    "mode": "browser-only",
    "upload": false,
    "tracking": false
  },
  "features": [
    "pretty",
    "minify",
    "validate",
    "tree",
    "typescript"
  ],
  "user": {
    "id": 1001,
    "name": "IdeaSeek",
    "roles": ["admin", "editor"],
    "profile": {
      "timezone": "Asia/Shanghai",
      "active": true
    }
  }
}`,
  `{
  "companyName": "珠海市智寻科技有限公司",
  "website": "https://www.ideaseek.cn",
  "province": "广东省",
  "city": "珠海市",
  "businessCategory": "软件开发",
  "contact": {
    "region": "South China",
    "timezone": "Asia/Shanghai"
  },
  "services": [
    "software development",
    "digital solutions",
    "technical consulting"
  ],
  "metadata": {
    "isLocalProcessing": true,
    "dataFormat": "json"
  }
}`,
];

export const useWorkbenchStore = defineStore('workbench', () => {
  const source = ref(SAMPLE_JSON);
  const formattedOutput = ref('');
  const generatedTypes = ref('');
  const parsedValue = shallowRef<JsonValue | null>(null);
  const validation = ref<ValidationState>({
    valid: true,
    message: '准备就绪',
  });
  const outputTab = ref<OutputTab>('formatted');
  const sortKeys = ref(false);
  const removeNulls = ref(false);
  const removeEmpty = ref(false);
  const lastCopiedPath = ref('$');
  const lastActionLabel = ref('格式化完成');
  const lastElapsedMs = ref(0);
  const lastCopiedAt = ref('');

  function formatClockTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function hydrateFromStorage() {
    if (typeof window === 'undefined') {
      return;
    }

    const draft = window.localStorage.getItem(STORAGE_KEY);
    if (draft && !LEGACY_SAMPLE_JSONS.includes(draft)) {
      source.value = draft;
    } else {
      source.value = SAMPLE_JSON;
      window.localStorage.setItem(STORAGE_KEY, SAMPLE_JSON);
    }
    refresh('pretty');
  }

  function persistDraft() {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, source.value);
  }

  function refresh(mode: 'pretty' | 'minify' | 'validate' = 'pretty') {
    const startedAt = performance.now();
    const result = parseJsonInput(source.value);
    validation.value = {
      valid: result.valid,
      message: result.message,
      line: result.location?.line,
      column: result.location?.column,
    };

    if (!result.valid || result.value === null) {
      parsedValue.value = null;
      formattedOutput.value = '';
      generatedTypes.value = '';
      lastActionLabel.value = '等待修复错误';
      lastElapsedMs.value = Math.round((performance.now() - startedAt) * 100) / 100;
      return;
    }

    const formatted = formatJson(source.value, {
      indentSize: 2,
      minify: mode === 'minify',
      sortKeys: sortKeys.value,
      removeNulls: removeNulls.value,
      removeEmpty: removeEmpty.value,
    });

    parsedValue.value = formatted.value;
    formattedOutput.value = formatted.output;
    generatedTypes.value = generateTypeScriptDefinitions('RootPayload', formatted.value);
    lastElapsedMs.value = Math.round((performance.now() - startedAt) * 100) / 100;

    switch (mode) {
      case 'pretty':
        lastActionLabel.value = '格式化完成';
        break;
      case 'minify':
        lastActionLabel.value = '压缩完成';
        break;
      case 'validate':
        lastActionLabel.value = '校验完成';
        break;
    }

    if (mode === 'minify' || mode === 'pretty') {
      outputTab.value = 'formatted';
    }
  }

  function updateSource(value: string) {
    source.value = value;
    persistDraft();
    refresh('validate');
  }

  function runPretty() {
    refresh('pretty');
  }

  function runMinify() {
    refresh('minify');
  }

  function runValidate() {
    refresh('validate');
  }

  function loadSample() {
    source.value = SAMPLE_JSON;
    persistDraft();
    refresh('pretty');
  }

  function clearSource() {
    source.value = '';
    formattedOutput.value = '';
    generatedTypes.value = '';
    parsedValue.value = null;
    validation.value = {
      valid: false,
      message: '请输入 JSON 内容',
    };
    lastActionLabel.value = '已清空内容';
    lastElapsedMs.value = 0;
    persistDraft();
  }

  function setOutputTab(tab: OutputTab) {
    outputTab.value = tab;
  }

  function toggleOption(option: 'sortKeys' | 'removeNulls' | 'removeEmpty') {
    switch (option) {
      case 'sortKeys':
        sortKeys.value = !sortKeys.value;
        break;
      case 'removeNulls':
        removeNulls.value = !removeNulls.value;
        break;
      case 'removeEmpty':
        removeEmpty.value = !removeEmpty.value;
        break;
    }
    refresh(outputTab.value === 'formatted' ? 'pretty' : 'validate');
  }

  function rememberPath(path: Array<string | number>) {
    lastCopiedPath.value = copyableJsonPath(path);
  }

  function markOutputCopied() {
    lastCopiedAt.value = formatClockTime(new Date());
  }

  return {
    source,
    formattedOutput,
    generatedTypes,
    parsedValue,
    validation,
    outputTab,
    sortKeys,
    removeNulls,
    removeEmpty,
    lastCopiedPath,
    lastActionLabel,
    lastElapsedMs,
    lastCopiedAt,
    hydrateFromStorage,
    persistDraft,
    refresh,
    updateSource,
    runPretty,
    runMinify,
    runValidate,
    loadSample,
    clearSource,
    setOutputTab,
    toggleOption,
    rememberPath,
    markOutputCopied,
  };
});
