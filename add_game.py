#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import datetime
import uuid

def load_games_json():
    """加载现有的games.json文件"""
    try:
        with open('data/games.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("错误：未找到games.json文件，请确保在正确的目录中运行该脚本")
        exit(1)
    except json.JSONDecodeError:
        print("错误：games.json文件格式不正确")
        exit(1)

def save_games_json(data):
    """保存更新后的games.json文件"""
    with open('data/games.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ 游戏信息已成功保存到games.json文件")

def get_input(prompt, default=None, required=True):
    """获取用户输入，支持默认值"""
    if default:
        result = input(f"{prompt} [{default}]: ").strip()
        if not result and default:
            return default
    else:
        result = input(f"{prompt}: ").strip()
    
    if required and not result:
        print("此字段为必填项，请提供一个值")
        return get_input(prompt, default, required)
    return result

def get_list_input(prompt):
    """获取列表输入"""
    print(f"{prompt} (输入空行结束)：")
    items = []
    while True:
        item = input("> ").strip()
        if not item:
            break
        items.append(item)
    return items

def get_category_input(categories):
    """获取分类输入，并验证输入的分类是否存在"""
    print("可用的游戏分类：")
    for category in categories:
        print(f"- {category['id']} ({category['name']})")
    
    while True:
        category_id = input("请输入游戏分类ID: ").strip()
        if not category_id:
            print("分类ID不能为空")
            continue
        
        if any(c['id'] == category_id for c in categories):
            return category_id
        else:
            print(f"警告: 未找到分类 '{category_id}'")
            create_new = input("是否创建新分类? (y/n): ").strip().lower()
            if create_new == 'y':
                return create_new_category(categories, category_id)
            # 如果不创建新分类，循环继续

def create_new_category(categories, category_id):
    """创建新的游戏分类"""
    name = get_input(f"分类名称", required=True)
    description = get_input(f"分类描述", required=True)
    color = get_input(f"分类颜色 (green/red/blue等)", default="blue")
    
    categories.append({
        "id": category_id,
        "name": name,
        "description": description,
        "color": color
    })
    
    print(f"✅ 已创建新分类: {name}")
    return category_id

def generate_game_id(title):
    """根据游戏标题生成ID"""
    # 转换为小写，移除特殊字符，用连字符替换空格
    base_id = ''.join(c for c in title.lower() if c.isalnum() or c.isspace())
    base_id = base_id.replace(' ', '-')
    return base_id

def add_new_game(data):
    """添加新游戏信息"""
    print("\n" + "="*50)
    print("添加新游戏")
    print("="*50 + "\n")
    
    # 获取游戏基本信息
    title = get_input("游戏标题", required=True)
    description = get_input("游戏描述", required=True)
    
    # 生成游戏ID
    suggested_id = generate_game_id(title)
    game_id = get_input(f"游戏唯一ID", default=suggested_id)
    
    # 检查ID是否已存在
    if any(g['id'] == game_id for g in data['games']):
        print(f"警告: ID '{game_id}' 已存在")
        override = input("是否覆盖现有游戏信息? (y/n): ").strip().lower()
        if override != 'y':
            print("操作取消")
            return False
        # 如果选择覆盖，移除现有游戏
        data['games'] = [g for g in data['games'] if g['id'] != game_id]
    
    # 获取游戏详细信息
    thumbnail_url = get_input("游戏缩略图URL", default=f"https://via.placeholder.com/300x200?text={title}")
    iframe_url = get_input("游戏iframe URL", required=True)
    category = get_category_input(data['categories'])
    tags = get_list_input("游戏标签 (如：益智、经典、动作等)")
    popularity = int(get_input("游戏人气 (1-100)", default="85"))
    date_added = get_input("添加日期 (YYYY-MM-DD)", default=datetime.date.today().isoformat())
    instructions = get_input("游戏玩法说明", required=True)
    tips = get_list_input("游戏小技巧")
    
    # 创建新游戏对象
    new_game = {
        "id": game_id,
        "title": title,
        "description": description,
        "thumbnailUrl": thumbnail_url,
        "iframeUrl": iframe_url,
        "category": category,
        "tags": tags,
        "popularity": popularity,
        "dateAdded": date_added,
        "instructions": instructions,
        "tips": tips
    }
    
    # 添加到游戏列表中
    data['games'].append(new_game)
    
    print(f"\n✅ 已添加新游戏: {title}")
    return True

def main():
    """主函数"""
    print("🎮 游戏信息添加工具\n")
    
    # 加载现有数据
    data = load_games_json()
    
    while True:
        if add_new_game(data):
            # 每添加一个游戏后保存一次
            save_games_json(data)
        
        add_another = input("\n是否继续添加游戏? (y/n): ").strip().lower()
        if add_another != 'y':
            break
    
    print("\n感谢使用游戏添加工具！")

if __name__ == "__main__":
    main() 