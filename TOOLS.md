# 游戏管理工具使用说明

本项目提供两种不同的自动化工具帮助你管理游戏数据：

1. **Python交互式添加工具** (add_game.py)：通过命令行交互方式一个个添加游戏
2. **Node.js批量导入工具** (import_games.js)：从CSV文件批量导入游戏数据

## Python交互式添加工具

这个工具适合少量游戏添加，提供友好的交互式界面引导你填写游戏信息。

### 使用方法

1. 确保安装了Python 3.6以上版本
2. 打开命令行终端，进入项目根目录
3. 运行以下命令：

```bash
python add_game.py
```

4. 按照提示输入游戏信息
5. 完成后，工具会自动更新data/games.json文件

### 功能特点

- 交互式引导输入
- 自动生成游戏ID
- 支持创建新游戏分类
- 自动检测ID冲突并提供处理选项
- 完整的数据验证

## Node.js批量导入工具

当你需要批量添加多个游戏时，这个工具能帮你从CSV文件一次性导入大量游戏数据。

### 使用方法

1. 确保安装了Node.js 10.0以上版本
2. 打开命令行终端，进入项目根目录
3. 先创建一个示例CSV文件（可选）：

```bash
node import_games.js --sample
```

4. 编辑生成的games_sample.csv文件，按照格式添加你的游戏数据
5. 导入CSV文件：

```bash
node import_games.js games_sample.csv
```

6. 完成后，工具会自动更新data/games.json文件

### CSV文件格式

CSV文件的第一行必须是标题行，包含以下字段：

```
title,description,thumbnailUrl,iframeUrl,category,tags,popularity,instructions,tip1,tip2,tip3,...
```

- **title**: 游戏标题（必填）
- **description**: 游戏描述（必填）
- **thumbnailUrl**: 游戏缩略图URL（选填，会自动生成占位图）
- **iframeUrl**: 游戏iframe URL（必填）
- **category**: 游戏分类（必填，必须是已存在的分类ID）
- **tags**: 游戏标签，用"|"分隔（例如：益智|经典|3D）
- **popularity**: 游戏人气值（1-100）
- **instructions**: 游戏玩法说明（必填）
- **tip1, tip2, ...**: 游戏小技巧（可添加多个）

### 功能特点

- 批量导入游戏数据
- 自动生成游戏ID
- 处理CSV格式特殊情况（引号内的逗号等）
- 完整的错误处理和日志输出
- 自动检测并更新已存在的游戏

## 注意事项

1. 两个工具都会修改`data/games.json`文件，建议先备份这个文件
2. CSV导入工具不会创建新分类，只使用已存在的分类
3. 游戏ID由标题自动生成，会移除特殊字符并用连字符替换空格
4. 修改后的games.json文件会立即反映在网站上，无需重启服务 

总结  你的游戏网站现在已完全设置好，并且有以下特点： 
1. 动态游戏页面：你只需要在data/games.json添加游戏信息，网站就会自动为每个游戏创建页面。当用户访问game.html?id=游戏ID时，系统会动态加载对应游戏并显示。  
 2. 自动化工具：  
• 单个添加：使用python add_game.py交互式添加游戏 
• 批量导入：使用node import_games.js从CSV批量导入游戏   
 3. 简单维护：  
 • 添加新游戏不需要修改HTML/JS代码  
 • 所有游戏信息集中在一个JSON文件中管理  
 • 自动生成游戏ID，自动检测重复   
 4. 完善的用户体验：  
 • 分类浏览  
 • 热门游戏和最新游戏展示  
 • 游戏详情和相关游戏推荐   
 这种设计既让网站维护变得简单，也提供了良好的扩展性。当你需要添加更多游戏时，只需使用提供的工具更新games.json文件即可，无需任何编程知识。 
 要运行网站，只需将整个文件夹上传到任何Web服务器，或使用python -m http.server在本地运行测试。