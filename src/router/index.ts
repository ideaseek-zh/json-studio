import HomeView from '@/views/HomeView.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      toolLabel: 'JSON工具',
      focus: 'workspace',
    },
  },
  {
    path: '/json-formatter',
    name: 'json-formatter',
    component: HomeView,
    meta: {
      toolLabel: 'JSON格式化',
      focus: 'formatted',
    },
  },
  {
    path: '/json-viewer',
    name: 'json-viewer',
    component: HomeView,
    meta: {
      toolLabel: 'JSON可视化',
      focus: 'tree',
    },
  },
  {
    path: '/json-tree',
    name: 'json-tree',
    component: HomeView,
    meta: {
      toolLabel: 'JSON树',
      focus: 'tree',
    },
  },
  {
    path: '/json-validator',
    name: 'json-validator',
    component: HomeView,
    meta: {
      toolLabel: 'JSON格式校验',
      focus: 'validation',
    },
  },
  {
    path: '/json-to-typescript',
    name: 'json-to-typescript',
    component: HomeView,
    meta: {
      toolLabel: '类型定义',
      focus: 'typescript',
    },
  },
  {
    path: '/json-minify',
    name: 'json-minify',
    component: HomeView,
    meta: {
      toolLabel: 'JSON压缩',
      focus: 'formatted',
    },
  },
];
