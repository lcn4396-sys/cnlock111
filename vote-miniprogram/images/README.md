# 小程序图标说明

## 已提供的 SVG 图标（基础库 2.12+ 支持）

| 文件 | 用途 |
|------|------|
| `icon-back.svg` | 首页导航栏 - 返回 |
| `icon-more.svg` | 首页导航栏 - 更多 |
| `icon-add.svg` | 首页导航栏 - 新建/添加 |
| `icon-arrow.svg` | 列表项、菜单项 - 右箭头 |
| `icon-default.svg` | 投票/轮播无图时的默认占位图 |
| `icon-vote.svg` | 我的 - 我的投票 |
| `icon-comment.svg` | 我的 - 我的评论 |
| `icon-report.svg` | 我的 - 我的举报 |
| `icon-settings.svg` | 我的 - 我的设置 |
| `icon-logout.svg` | 我的 - 退出登录 |

## tabBar 图标（须为 PNG）

`app.json` 中底部导航栏使用的图标**必须为 PNG**（不支持 SVG），建议尺寸 **81×81** 像素：

- `tab-home.png` / `tab-home-active.png` - 首页（未选/选中）
- `tab-vote.png` / `tab-vote-active.png` - 投票（未选/选中）
- `tab-my.png` / `tab-my-active.png` - 我的（未选/选中）

若需重新生成小体积（&lt;40KB）tabBar 图标，在项目根目录下执行：`powershell -File scripts/GenTabIcons.ps1`（需 Windows + .NET）。未选为灰色 #999，选中为绿色 #07c160。
