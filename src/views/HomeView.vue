<template>
  <main class="studio-shell">
    <header class="topbar">
      <div class="brand">
        <img
          class="brand-logo"
          :src="logoUrl"
          alt="JSON Studio"
        />
        <div class="brand-copy">
          <h1>JSON Studio</h1>
          <p>ideaSeek JSON 工具箱</p>
        </div>
      </div>

      <nav class="top-tool-nav">
        <RouterLink
          v-for="tool in topTools"
          :key="tool.to"
          :to="tool.to"
          class="top-tool-link"
          :class="{ active: activeToolPath === tool.to }"
          :title="tool.label"
        >
          <UiIcon :name="tool.icon" />
          <span>{{ tool.label }}</span>
        </RouterLink>
      </nav>

      <div class="topbar-actions">
        <button
          type="button"
          class="icon-button ghost"
          :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          :title="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          @click="toggleTheme"
        >
          <UiIcon name="sun" />
        </button>
        <button
          type="button"
          class="theme-switch"
          :class="{ active: theme === 'light' }"
          :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          :aria-pressed="theme === 'light'"
          :title="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          @click="toggleTheme"
        >
          <span class="theme-switch-thumb"></span>
        </button>
      </div>
    </header>

    <section class="studio-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <h2>工具箱</h2>
          <nav class="sidebar-nav">
            <RouterLink
              v-for="tool in sideTools"
              :key="tool.to"
              :to="tool.to"
              class="sidebar-link"
              :class="{ active: activeToolPath === tool.to }"
              :title="tool.label"
            >
              <UiIcon :name="tool.icon" />
              <span>{{ tool.label }}</span>
            </RouterLink>
          </nav>
        </div>

        <div class="sidebar-section">
          <h2>快速操作</h2>
          <div class="quick-actions">
            <button
              type="button"
              class="quick-action"
              title="加载示例 JSON"
              @click="store.loadSample"
            >
              <UiIcon name="folder" />
              <span>加载示例</span>
            </button>
            <button
              type="button"
              class="quick-action"
              title="清空当前输入和结果"
              @click="store.clearSource"
            >
              <UiIcon name="trash" />
              <span>清空内容</span>
            </button>
            <button
              type="button"
              class="quick-action"
              title="复制当前输出结果"
              @click="copyOutput"
            >
              <UiIcon name="copy" />
              <span>复制结果</span>
            </button>
            <button
              type="button"
              class="quick-action"
              title="下载当前输出结果"
              @click="downloadOutput"
            >
              <UiIcon name="download" />
              <span>下载结果</span>
            </button>
          </div>
        </div>

        <div class="tips-card">
          <div class="tips-card-title">
            <UiIcon name="spark" />
            <span>小贴士</span>
          </div>
          <p>支持拖拽文件到输入框，直接格式化 JSON 内容。</p>
        </div>
      </aside>

      <section class="workspace-frame">
        <div class="workspace-grid">
          <article class="work-card">
            <div class="work-card-header">
              <div class="work-card-title">
                <h2>JSON 输入</h2>
              </div>
              <div class="work-card-actions">
                <button
                  type="button"
                  class="format-option"
                  :class="{ active: store.sortKeys }"
                  :aria-pressed="store.sortKeys"
                  title="按键名字母顺序排序"
                  @click="store.toggleOption('sortKeys')"
                >
                  键名排序
                </button>
                <button
                  type="button"
                  class="format-option"
                  :class="{ active: store.removeNulls }"
                  :aria-pressed="store.removeNulls"
                  title="移除值为 Null 的字段"
                  @click="store.toggleOption('removeNulls')"
                >
                  移除 Null
                </button>
                <button
                  type="button"
                  class="format-option"
                  :class="{ active: store.removeEmpty }"
                  :aria-pressed="store.removeEmpty"
                  title="移除空对象、空数组和空字符串"
                  @click="store.toggleOption('removeEmpty')"
                >
                  移除空值
                </button>
                <button
                  type="button"
                  class="icon-button"
                  @click="store.loadSample"
                  aria-label="加载示例"
                  title="加载示例 JSON"
                >
                  <UiIcon name="folder" />
                </button>
                <button
                  type="button"
                  class="icon-button"
                  @click="store.clearSource"
                  aria-label="清空内容"
                  title="清空当前输入和结果"
                >
                  <UiIcon name="trash" />
                </button>
                <button
                  type="button"
                  class="icon-button"
                  aria-label="展开"
                  title="展开编辑区域"
                >
                  <UiIcon name="expand" />
                </button>
              </div>
            </div>

            <JsonCodePane
              :model-value="store.source"
              editable
              @update:model-value="store.updateSource"
            />

            <footer class="status-bar">
              <div class="status-left">
                <span
                  class="status-dot"
                  :class="store.validation.valid ? 'success' : 'error'"
                ></span>
                <span
                  class="status-text"
                  :class="store.validation.valid ? 'success' : 'error'"
                >
                  {{ store.validation.valid ? '有效 JSON' : store.validation.message }}
                </span>
              </div>
              <div class="status-meta">
                <span>{{ inputStats.lines }} 行</span>
                <span>{{ inputStats.characters }} 字符</span>
                <span>UTF-8</span>
              </div>
            </footer>
          </article>

          <article class="work-card">
            <div class="work-card-header">
              <div class="work-card-title">
                <h2>输出结果</h2>
              </div>
              <div class="output-toolbar">
                <div class="output-tabs">
                  <button
                    v-for="tab in outputTabs"
                    :key="tab.value"
                    type="button"
                    class="output-tab"
                    :class="{ active: store.outputTab === tab.value }"
                    :title="tab.label"
                    @click="store.setOutputTab(tab.value)"
                  >
                    {{ tab.label }}
                  </button>
                </div>
                <button
                  type="button"
                  class="icon-button"
                  @click="copyOutput"
                  aria-label="复制结果"
                  title="复制当前输出结果"
                >
                  <UiIcon name="copy" />
                </button>
              </div>
            </div>

            <JsonCodePane
              v-if="store.outputTab === 'formatted'"
              :model-value="store.formattedOutput || '等待格式化结果…'"
            />

            <section
              v-else-if="store.outputTab === 'tree'"
              class="tree-output-shell"
            >
              <JsonTreeView
                :value="store.parsedValue"
                @select-path="handleSelectPath"
              />
            </section>

            <JsonCodePane
              v-else
              :model-value="store.generatedTypes || '当前 JSON 无法生成类型定义。'"
            />

            <footer class="status-bar">
              <div class="status-left">
                <span class="status-dot success"></span>
                <span class="status-text success">{{ store.lastActionLabel }}</span>
              </div>
              <div class="status-meta">
                <span>{{ outputStats.lines }} 行</span>
                <span>{{ outputStats.characters }} 字符</span>
                <span>耗时 {{ displayElapsed }}ms</span>
                <span>复制时间 {{ store.lastCopiedAt || '--:--:--' }}</span>
              </div>
            </footer>
          </article>
        </div>

        <section class="content-stack">
          <section class="content-card intro-card">
            <h2>JSON Studio 是一个面向开发者与企业用户的专业 JSON 工具箱</h2>
            <p>
              我们提供 JSON 格式化、JSON 压缩、JSON 格式校验、JSON 树视图、JSON 可视化和类型定义生成等常用能力，
              让用户在一个页面里完成最常见的 JSON 处理工作流。
            </p>
            <p>
              与传统在线 JSON 工具不同，JSON Studio 更强调本地处理、快速响应和结构清晰，适合前端开发、后端联调、
              测试排查、日志分析和数据整理等真实工作场景，也更有利于搜索引擎和 AI 回答系统准确理解页面内容。
            </p>
            <div class="intro-tags">
              <span>本地处理</span>
              <span>无需上传</span>
              <span>结果即得</span>
            </div>
          </section>

          <section class="content-card">
            <div class="content-heading">
              <h2>为什么选择我们的 JSON 工具箱</h2>
            </div>
            <div class="benefit-grid">
              <article class="benefit-card">
                <h3>纯本地处理，更适合敏感数据</h3>
                <p>所有 JSON 数据都在浏览器内完成处理，不需要上传到服务器，适合接口返回、业务配置、日志片段等敏感内容。</p>
              </article>
              <article class="benefit-card">
                <h3>一个工具覆盖常见 JSON 工作流</h3>
                <p>从格式化、压缩、校验，到树视图和类型定义生成，减少在多个网站之间来回切换的成本。</p>
              </article>
              <article class="benefit-card">
                <h3>更适合开发、测试与数据分析场景</h3>
                <p>支持快速查看层级结构、定位字段内容、复制结果和下载结果，方便接口联调和数据排查。</p>
              </article>
              <article class="benefit-card">
                <h3>界面聚焦输入与输出，效率更高</h3>
                <p>我们把最重要的 JSON 输入与输出并列展示，让你能更直观地比对处理前后的结果。</p>
              </article>
            </div>
          </section>

          <section class="content-card">
            <div class="content-heading">
              <h2>适用场景</h2>
            </div>
            <div class="scenario-grid">
              <article class="scenario-card">
                <h3>接口调试</h3>
                <p>查看接口返回 JSON 是否合法、字段是否完整，并快速转换为更易阅读的结构。</p>
              </article>
              <article class="scenario-card">
                <h3>日志排查</h3>
                <p>把日志中的单行 JSON 压缩串快速格式化，方便定位字段、状态值和异常信息。</p>
              </article>
              <article class="scenario-card">
                <h3>前端建模</h3>
                <p>把实际返回数据转换成 TypeScript 类型定义，提升接口封装和组件开发效率。</p>
              </article>
              <article class="scenario-card">
                <h3>数据清洗</h3>
                <p>通过压缩、键名排序和移除空值等能力，让 JSON 数据更整洁，便于传输与存档。</p>
              </article>
            </div>
          </section>

          <section class="content-card faq-card">
            <div class="content-heading">
              <h2>常见问题 FAQ</h2>
            </div>
            <div class="faq-list">
              <article class="faq-item">
                <h3>这个 JSON 工具箱会上传我的数据吗？</h3>
                <p>不会。当前工具以浏览器本地处理为核心，JSON 内容不会主动上传到服务器，更适合处理敏感数据。</p>
              </article>
              <article class="faq-item">
                <h3>这个工具适合哪些人使用？</h3>
                <p>适合前端工程师、后端工程师、测试工程师、数据分析人员，以及需要频繁查看和整理 JSON 的用户。</p>
              </article>
              <article class="faq-item">
                <h3>为什么JSON格式化后的结果和原始输入不一样？</h3>
                <p>如果你启用了键名排序、移除 Null 或移除空值等选项，输出结果会在格式化的同时进行结构整理。</p>
              </article>
              <article class="faq-item">
                <h3>可以直接把 JSON 转成类型定义吗？</h3>
                <p>可以。当前页面支持把 JSON 转成类型定义，适合在前端项目中快速生成基础接口结构。</p>
              </article>
              <article class="faq-item">
                <h3>什么是JSON可视化？</h3>
                <p>JSON 可视化是把原始 JSON 文本转换成更直观的层级结构展示方式，方便查看对象、数组、字段关系和嵌套内容，适合阅读复杂数据。</p>
              </article>
              <article class="faq-item">
                <h3>使用这个工具需要安装软件或注册账号吗？</h3>
                <p>不需要。打开浏览器即可直接使用，大部分常用能力都能在当前页面内完成，不依赖额外安装或登录流程。</p>
              </article>
              <article class="faq-item">
                <h3>可以在格式化和压缩之间快速切换吗？</h3>
                <p>可以。你可以直接在同一份 JSON 上执行格式化或压缩操作，方便在阅读、复制、传输和存储之间快速切换。</p>
              </article>
            </div>
          </section>
        </section>
      </section>
    </section>

    <footer class="site-footer">
      <p>© 2026 <a href="https://www.ideaseek.cn/">ideaseek</a> <a href="https://www.ideaseek.cn/">智寻科技</a> <a href="https://json.ideaseek.cn/">JSON Studio</a>. All rights reserved.</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import faviconUrl from '@/assets/images/favicon.ico';
import logoUrl from '@/assets/images/logo.svg';
import JsonCodePane from '@/components/JsonCodePane.vue';
import JsonTreeView from '@/components/JsonTreeView.vue';
import UiIcon from '@/components/UiIcon.vue';
import { useWorkbenchStore, type OutputTab } from '@/stores/workbench';
import { countJsonTextStats } from '@/utils/json';

const route = useRoute();
const store = useWorkbenchStore();
const SITE_URL = 'https://json.ideaseek.cn';
const currentRoutePath = computed(() => route.path);
const activeToolPath = computed(() => (route.path === '/json-formatter' ? '/' : route.path));
const THEME_STORAGE_KEY = 'json-studio:theme';
const theme = ref<'dark' | 'light'>('dark');

const seoMap: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string;
  }
> = {
  '/json-formatter': {
    title: 'JSON 格式化工具 - 在线美化 JSON 文本 | JSON Studio',
    description:
      '使用 JSON Studio 在线格式化 JSON，支持美化缩进、键名排序、移除空值与本地处理，无需上传数据即可快速整理 JSON 内容。',
    keywords: 'JSON格式化,在线JSON格式化,JSON美化,JSON整理,JSON工具',
  },
  '/json-viewer': {
    title: 'JSON 可视化工具 - 在线查看 JSON 结构 | JSON Studio',
    description:
      '在线可视化 JSON 结构，快速查看对象层级、数组内容和字段关系，适合接口调试、数据阅读和结构分析。',
    keywords: 'JSON可视化,JSON查看器,JSON结构查看,JSON在线工具',
  },
  '/json-tree': {
    title: 'JSON 树工具 - JSON 树结构查看与搜索 | JSON Studio',
    description:
      '使用 JSON 树视图查看和搜索数据结构，支持展开折叠、路径定位和本地处理，适合复杂 JSON 的快速分析。',
    keywords: 'JSON树,JSON树视图,JSON路径,JSON结构搜索',
  },
  '/json-validator': {
    title: 'JSON 格式校验工具 - 在线校验 JSON 是否有效 | JSON Studio',
    description:
      '在线校验 JSON 格式是否正确，快速发现语法问题、定位错误位置，适合接口联调、日志检查和数据清洗。',
    keywords: 'JSON校验,JSON验证,JSON格式检查,在线JSON校验',
  },
  '/json-to-typescript': {
    title: 'JSON 转类型定义 - 在线生成 TypeScript 接口 | JSON Studio',
    description:
      '将 JSON 数据快速转换为 TypeScript 类型定义，帮助前端开发提升接口建模效率，减少手写类型成本。',
    keywords: 'JSON转TypeScript,TS接口生成,JSON类型定义,TypeScript工具',
  },
  '/json-minify': {
    title: 'JSON 压缩工具 - 在线压缩 JSON 文本 | JSON Studio',
    description:
      '在线压缩 JSON，去掉多余空格与换行，适合传输、存储和快速复制，同时支持本地浏览器处理。',
    keywords: 'JSON压缩,JSON最小化,在线压缩JSON,JSON工具',
  },
};

const defaultSeo = {
  title: 'JSON 格式化、压缩、校验、可视化的在线JSON工具箱 - JSON Studio',
  description:
    'JSON Studio 是一个专业的 JSON 工具箱，支持 JSON 格式化、压缩、校验、树视图、可视化和类型定义生成，全部在浏览器本地完成。',
  keywords: 'JSON工具箱,JSON格式化,JSON压缩,JSON校验,JSON可视化',
};

const currentSeo = computed(() => seoMap[currentRoutePath.value] ?? defaultSeo);
const canonicalUrl = computed(() =>
  currentRoutePath.value === '/' ? SITE_URL : `${SITE_URL}${currentRoutePath.value}`,
);

const topTools = [
  { to: '/', label: '格式化', icon: 'format' as const },
  { to: '/json-viewer', label: '可视化', icon: 'viewer' as const },
  { to: '/json-tree', label: 'JSON 树', icon: 'tree' as const },
  { to: '/json-validator', label: '校验', icon: 'validate' as const },
  { to: '/json-minify', label: '压缩', icon: 'minify' as const },
  { to: '/json-to-typescript', label: '类型定义', icon: 'typescript' as const },
];

const sideTools = [
  { to: '/', label: 'JSON 格式化', icon: 'format' as const },
  { to: '/json-viewer', label: 'JSON 可视化', icon: 'viewer' as const },
  { to: '/json-tree', label: 'JSON 树', icon: 'tree' as const },
  { to: '/json-validator', label: '格式校验', icon: 'validate' as const },
  { to: '/json-to-typescript', label: '类型定义', icon: 'typescript' as const },
  { to: '/json-minify', label: 'JSON 压缩', icon: 'minify' as const },
];

const outputTabs: Array<{ value: OutputTab; label: string }> = [
  { value: 'formatted', label: '格式化结果' },
  { value: 'tree', label: '树视图' },
  { value: 'typescript', label: '类型定义' },
];

const inputStats = computed(() => countJsonTextStats(store.source));
const outputStats = computed(() => {
  const value =
    store.outputTab === 'formatted'
      ? store.formattedOutput
      : store.outputTab === 'tree'
        ? JSON.stringify(store.parsedValue ?? {}, null, 2)
        : store.generatedTypes;
  return countJsonTextStats(value);
});

const displayElapsed = computed(() => {
  const elapsed = store.lastElapsedMs;
  return Number.isInteger(elapsed) ? elapsed.toFixed(0) : elapsed.toFixed(2);
});

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'JSON Studio',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      description: currentSeo.value.description,
      featureList: [
        'JSON 格式化',
        'JSON 压缩',
        'JSON 格式校验',
        'JSON 树视图',
        'JSON 可视化',
        '类型定义生成',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '这个 JSON 工具箱会上传我的数据吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '不会。当前工具以浏览器本地处理为核心，JSON 内容不会主动上传到服务器，更适合处理敏感数据。',
          },
        },
        {
          '@type': 'Question',
          name: '这个工具适合哪些人使用？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '适合前端工程师、后端工程师、测试工程师、数据分析人员，以及需要频繁查看和整理 JSON 的用户。',
          },
        },
        {
          '@type': 'Question',
          name: '为什么JSON格式化后的结果和原始输入不一样？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '如果你启用了键名排序、移除 Null 或移除空值等选项，输出结果会在格式化的同时进行结构整理。',
          },
        },
        {
          '@type': 'Question',
          name: '可以直接把 JSON 转成类型定义吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '可以。当前页面支持把 JSON 转成类型定义，适合在前端项目中快速生成基础接口结构。',
          },
        },
        {
          '@type': 'Question',
          name: '什么是JSON可视化？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'JSON 可视化是把原始 JSON 文本转换成更直观的层级结构展示方式，方便查看对象、数组、字段关系和嵌套内容，适合阅读复杂数据。',
          },
        },
        {
          '@type': 'Question',
          name: '使用这个工具需要安装软件或注册账号吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '不需要。打开浏览器即可直接使用，大部分常用能力都能在当前页面内完成，不依赖额外安装或登录流程。',
          },
        },
        {
          '@type': 'Question',
          name: '可以在格式化和压缩之间快速切换吗？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '可以。你可以直接在同一份 JSON 上执行格式化或压缩操作，方便在阅读、复制、传输和存储之间快速切换。',
          },
        },
      ],
    },
  ],
}));

useHead(() => ({
  title: currentSeo.value.title,
  htmlAttrs: {
    lang: 'zh-CN',
  },
  meta: [
    {
      name: 'description',
      content: currentSeo.value.description,
    },
    {
      name: 'keywords',
      content: currentSeo.value.keywords,
    },
    {
      property: 'og:title',
      content: currentSeo.value.title,
    },
    {
      property: 'og:description',
      content: currentSeo.value.description,
    },
    {
      property: 'og:url',
      content: canonicalUrl.value,
    },
    {
      property: 'og:locale',
      content: 'zh_CN',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: faviconUrl,
    },
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
  script: [
    {
      id: 'json-studio-schema',
      type: 'application/ld+json',
      textContent: JSON.stringify(faqSchema.value),
    },
  ],
}));

function handleSelectPath(path: Array<string | number>) {
  store.rememberPath(path);
}

async function copyOutput() {
  const value =
    store.outputTab === 'formatted'
      ? store.formattedOutput
      : store.outputTab === 'tree'
        ? JSON.stringify(store.parsedValue ?? {}, null, 2)
        : store.generatedTypes;

  if (!value || typeof navigator === 'undefined' || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(value);
  store.markOutputCopied();
}

function downloadOutput() {
  const value =
    store.outputTab === 'formatted'
      ? store.formattedOutput
      : store.outputTab === 'tree'
        ? JSON.stringify(store.parsedValue ?? {}, null, 2)
        : store.generatedTypes;

  if (!value || typeof document === 'undefined') {
    return;
  }

  const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = store.outputTab === 'typescript' ? 'json-types.txt' : 'json-output.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function applyTheme(value: 'dark' | 'light') {
  theme.value = value;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value);
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  }
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }
  store.hydrateFromStorage();
});

watch(
  () => route.meta.focus,
  (focus) => {
    if (focus === 'tree') {
      store.setOutputTab('tree');
      return;
    }
    if (focus === 'typescript') {
      store.setOutputTab('typescript');
      return;
    }
    store.setOutputTab('formatted');
  },
  { immediate: true },
);
</script>
