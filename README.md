# 游戏天地 - 在线游戏网站

这是一个简单的在线游戏网站，使用纯HTML、CSS和JavaScript构建，无需服务器端代码，易于部署和扩展。

## 功能特点

- 响应式设计，适配移动端和桌面端
- 游戏分类和筛选
- 游戏详情页面，支持iframe嵌入游戏
- 热门游戏和最新游戏推荐
- JSON数据驱动，轻松添加新游戏

## 如何添加新游戏

1. 打开 `data/games.json` 文件
2. 在 `games` 数组中添加新的游戏对象，遵循以下格式：

```json
{
  "id": "游戏唯一ID", 
  "title": "游戏标题",
  "description": "游戏描述", 
  "thumbnailUrl": "游戏缩略图URL",
  "iframeUrl": "游戏iframe URL", 
  "category": "puzzle/action/strategy等分类ID", 
  "tags": ["标签1", "标签2"],
  "popularity": 85, 
  "dateAdded": "YYYY-MM-DD",
  "instructions": "游戏玩法说明",
  "tips": ["小技巧1", "小技巧2", "小技巧3"]
}
```

3. 保存文件，网站将自动加载新添加的游戏

## 如何添加新分类

1. 打开 `data/games.json` 文件
2. 在 `categories` 数组中添加新的分类对象：

```json
{
  "id": "分类唯一ID",
  "name": "分类名称",
  "description": "分类描述",
  "color": "颜色名称(如blue/green/red等)"
}
```

3. 保存文件，然后在导航栏和首页分类部分添加对应的链接

## 本地运行

只需使用任何HTTP服务器在本地托管文件夹，例如：

- 使用Python：`python -m http.server`
- 使用Node.js：安装`http-server`并运行

## 部署建议

1. 上传所有文件到网站托管服务 
2. 确保域名正确配置
3. 建议启用HTTPS以保证iframe嵌入的安全性

## 文件结构

- `index.html` - 首页
- `game.html` - 游戏详情页
- `category.html` - 分类页面
- `css/` - 样式文件
- `js/` - JavaScript文件
- `data/` - 存储游戏数据的JSON文件

## 兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
- 不支持IE11及以下版本

## 未来扩展计划

- 添加搜索功能
- 游戏评分和评论系统
- 用户登录和收藏功能
- 更丰富的游戏分类和标签

