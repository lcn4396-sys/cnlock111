# 在线投票评选系统 - 微信小程序

微信小程序原生项目，与后端 API（http://localhost:8081）交互。

## 确保后端服务已启动

**vote-backend** 需先运行在 **http://localhost:8081**，小程序才能正常请求接口。

在项目根目录的 `vote-backend` 下执行：

```bash
cd vote-backend
.\run.ps1
```

或使用 Maven：`mvn spring-boot:run`。启动成功后访问 http://localhost:8081/ 或 http://localhost:8081/health 可验证。

## 目录结构

- `app.js` / `app.json` / `app.wxss`：入口与全局配置
- `pages/`：首页、投票列表、详情、结果、创建、参与、分享、我的
- `components/`：轮播图、分类栏、投票卡片、评论项、创建投票弹窗
- `utils/`：request（统一请求与 baseURL）、auth、util
- `api/`：banner、category、vote、comment、report、user
- `config/env.js`：后端地址前缀 `http://localhost:8081`
- `images/`：导航/菜单等已使用 SVG 图标（见 `images/README.md`）；底部 tabBar 需 81×81 的 PNG，若占位不显示请替换

## 启动方式

1. **先启动后端**：在 `vote-backend` 目录执行 `.\run.ps1`，确保服务运行在 http://localhost:8081
2. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
3. 打开微信开发者工具 → 导入项目 → 选择本目录 `vote-miniprogram`
4. 在「详情」→「本地设置」中勾选 **不校验合法域名**（便于本地调试 localhost）
5. 编译运行即可

## 首页布局说明

参考 UI 示意图：顶部导航（返回、首页、更多、添加）、轮播图、分类列表、创建投票按钮、参与投票按钮。

## 后端地址

默认使用 `config/env.js` 中的 `baseURL`（`http://localhost:8081`）。

真机调试时（手机访问电脑后端），可在开发者工具 Console 执行：

```js
wx.setStorageSync('dev_base_url', 'http://你的电脑局域网IP:8081')
```

查看当前实际请求地址：

```js
wx.getStorageSync('dev_base_url')
```

恢复默认地址：

```js
wx.removeStorageSync('dev_base_url')
```
