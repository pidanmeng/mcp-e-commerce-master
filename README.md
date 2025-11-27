# e-commerce-master

这是一个基于 [FastMCP](https://github.com/fastmcp/fastmcp) 框架构建的 MCP (Model Context Protocol) 工具包。

## 功能

影楼后期大师实现了多个实用的图像处理工具：

- `查询生图任务状态`: 查询生图任务状态，并以自然语言形式输出结果
- `产品图精修`: 产品图精修工具，改为白色背景
- `产品场景渲染图`: 产品场景渲染图，通过产品图生成带场景的渲染图
- `3D电商KV海报`: 生成 3D 电商 KV 海报
- `电商产品海报`: 质感商业级电商产品场景海报
- `小红书风格海报`: 生成小红书风格的海报
- `宠物风格海报`: 生成卡通风格宠物海报（默认 16:9）

## 部署 MCP

```JSON
{
  "mcpServers": {
    "e-commerce-master": {
      "args": ["-y","@pidanmoe/e-commerce-master"],
      "command": "npx",
      "env": {
        "LIB_SECRET_KEY": "",
        "LIB_ACCESS_KEY": ""
      }
    }
  }
}
```

## 使用说明

该项目遵循 Model Context Protocol 规范，可以通过标准 I/O 或其他传输方式与支持 MCP 的客户端进行通信。

### 工具介绍

#### 产品图精修

产品图精修工具，对商品图片进行专业精修处理

- 必填参数:
  - `productImageUrl`: 商品图的 URL 地址
- 返回: 生图任务结果

#### 产品场景渲染图

通过产品图生成带场景的渲染图工具，基于产品图片生成具有特定场景的高质量渲染图

- 必填参数:
  - `productImageUrl`: 产品图的 URL 地址
  - `prompt`: 场景描述提示词
- 可选参数:
  - `size`: 生成图片尺寸，可选 1k、2k、4k
  - `width`: 图片宽度
  - `height`: 图片高度
- 返回: 生图任务结果

#### 查询生图任务状态

查询生图任务状态，并以自然语言形式输出结果

- 必填参数:
  - `generateUuid`: 生图任务 UUID，发起生图任务时返回的字段
- 返回: 任务状态的自然语言描述

#### 3D 电商 KV 海报

生成 3D 电商 KV 海报

- 可选参数:
  - `prompt`: 提示词，建议：FY style + 自然语言描述内容
- 默认参数:
  - 使用赛博朋克风格的电商促销场景提示词
- 返回: 生图任务结果

#### 电商产品海报

质感商业级电商产品场景海报

- 可选参数:
  - `prompt`: 提示词，建议：Product Scene Poster + 自然语言描述内容
- 默认参数:
  - 使用商业级奢侈品香水摄影提示词
- 返回: 生图任务结果

#### 小红书风格海报

生成小红书风格的海报

- 可选参数:
  - `prompt`: 提示词，建议：FY style + 自然语言描述内容
- 默认参数:
  - 使用升学季海报提示词
- 返回: 生图任务结果

#### 宠物风格海报

生成卡通风格宠物海报（默认 16:9）

- 可选参数:
  - `prompt`: 提示词
- 默认参数:
  - 使用可爱宠物主题提示词
- 返回: 生图任务结果

## 安装依赖

```bash
bun install
```

## 运行项目

```bash
bun run dev
```

## 调试项目

```bash
bun run inspect
```

## 构建项目

```bash
bun run build
```

## 项目结构

- [index.ts](file:///Volumes/SSD/_work/e-commerce-master/src/index.ts): 主入口文件，初始化并启动 FastMCP 服务器
- [tools/](file:///Volumes/SSD/_work/e-commerce-master/src/tools/): 工具目录，包含各种图像处理工具
  - [check-image-generation-status.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/check-image-generation-status.ts): 实现了生图任务状态查询工具
  - [product-image-retouching.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/product-image-retouching.ts): 实现了产品图精修工具
  - [scene-rendering-from-product-image.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/scene-rendering-from-product-image.ts): 实现了产品场景渲染工具
  - [kvPoster.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/kvPoster.ts): 实现了 3D 电商 KV 海报工具
  - [productPoster.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/productPoster.ts): 实现了电商产品海报工具
  - [xiaohongshuPoster.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/xiaohongshuPoster.ts): 实现了小红书风格海报工具
  - [petPoster.ts](file:///Volumes/SSD/_work/e-commerce-master/src/tools/petPoster.ts): 实现了宠物风格海报工具
- [utils/](file:///Volumes/SSD/_work/e-commerce-master/src/utils/): 工具类目录
  - [logger.ts](file:///Volumes/SSD/_work/e-commerce-master/src/utils/logger.ts): 日志工具模块
  - [comfyui.ts](file:///Volumes/SSD/_work/e-commerce-master/src/utils/comfyui.ts): ComfyUI 接口调用模块

## 技术栈

- [Bun](https://bun.sh) - JavaScript/TypeScript 运行时
- [FastMCP](https://github.com/fastmcp/fastmcp) - MCP 框架
- [Zod](https://zod.dev) - TypeScript-first schema declaration and validation library

---

此项目使用 bun v1.2.19 创建。[Bun](https://bun.com) 是一个快速的一体化 JavaScript 运行时。
