# JSON Studio

JSON Studio 是一个面向中文用户的在线 JSON 工具箱，支持 JSON 格式化、压缩、校验、可视化、树视图和 TypeScript 类型定义生成。

项目维护方：ideaseek / 珠海市智寻科技有限公司

演示地址：[https://json.ideaseek.cn/](https://json.ideaseek.cn/)

## 项目特点

- 浏览器本地处理 JSON 内容，不依赖上传数据到服务器
- 支持 JSON 格式化、JSON 压缩、JSON 格式校验
- 支持 JSON 可视化和 JSON 树结构展示
- 支持根据 JSON 数据生成 TypeScript 类型定义
- 支持预渲染静态 HTML，便于 SEO 与内容索引
- 提供中文界面，适合中文用户和业务场景

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vite SSG
- Vue Router
- Pinia
- `jsonc-parser`

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

## 构建

生成预渲染静态页面：

```bash
npm run build
```

构建完成后，静态文件输出在 `dist/` 目录。

本地预览构建结果：

```bash
npm run preview
```

## 测试

```bash
npm run test
```

## 主要页面能力

- 首页：JSON Studio 工具总入口
- `/json-viewer`：JSON 可视化
- `/json-tree`：JSON 树视图
- `/json-validator`：JSON 格式校验
- `/json-to-typescript`：JSON 转 TypeScript 类型定义
- `/json-minify`：JSON 压缩

说明：
`/` 为主入口页面。
`/json-formatter` 为兼容与预渲染保留路由。

## 目录结构

```text
src/
  assets/
    images/
  components/
  router/
  stores/
  utils/
  views/
  App.vue
  main.ts
  styles.css
public/
dist/
```

## 开源许可

本项目基于 MIT License 开源，详见 [LICENSE](./LICENSE)。

## 版权说明

Copyright (c) 2026 ideaseek

珠海市智寻科技有限公司

Zhuhai Zhixun Technology Co., Ltd.
