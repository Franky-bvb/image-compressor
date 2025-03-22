/**
 * 游戏批量导入工具
 * 从CSV文件批量导入游戏数据到games.json
 * 
 * CSV格式示例：
 * title,description,thumbnailUrl,iframeUrl,category,tags,popularity,instructions
 * 俄罗斯方块,经典的俄罗斯方块游戏...,https://example.com/tetris.jpg,https://games.example.com/tetris,puzzle,"益智,经典",95,使用方向键控制方块...
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// CSV分隔符
const CSV_DELIMITER = ',';
// 数据文件路径
const GAMES_JSON_PATH = path.join(__dirname, 'data', 'games.json');
// 默认标签分隔符
const TAG_DELIMITER = '|';

/**
 * 从CSV行解析游戏数据
 * @param {string} line CSV行
 * @param {string} delimiter 分隔符
 * @returns {Object} 游戏数据对象
 */
function parseGameFromCSV(line, delimiter = CSV_DELIMITER) {
    // 处理引号内的逗号
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    // 添加最后一个值
    values.push(currentValue);
    
    // 清理值（移除引号等）
    const cleanedValues = values.map(value => {
        // 移除首尾引号
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        return value.trim();
    });
    
    // 解析为游戏对象
    const [title, description, thumbnailUrl, iframeUrl, category, tagsStr, popularityStr, instructions, ...tipsArray] = cleanedValues;
    
    // 生成ID
    const id = generateGameId(title);
    
    // 解析标签
    const tags = tagsStr ? tagsStr.split(TAG_DELIMITER).map(tag => tag.trim()) : [];
    
    // 解析人气值
    const popularity = parseInt(popularityStr || '85', 10);
    
    // 创建游戏对象
    return {
        id,
        title,
        description,
        thumbnailUrl: thumbnailUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`,
        iframeUrl,
        category,
        tags,
        popularity,
        dateAdded: new Date().toISOString().split('T')[0], // 今天的日期
        instructions,
        tips: tipsArray.filter(tip => tip.trim().length > 0) // 过滤空提示
    };
}

/**
 * 根据游戏标题生成ID
 * @param {string} title 游戏标题
 * @returns {string} 游戏ID
 */
function generateGameId(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // 移除特殊字符
        .replace(/\s+/g, '-'); // 空格替换为连字符
}

/**
 * 加载games.json文件
 * @returns {Promise<Object>} 游戏数据
 */
async function loadGamesJson() {
    try {
        const data = await fs.promises.readFile(GAMES_JSON_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('错误：无法读取games.json文件');
        console.error(error);
        process.exit(1);
    }
}

/**
 * 保存games.json文件
 * @param {Object} data 游戏数据
 */
async function saveGamesJson(data) {
    try {
        await fs.promises.writeFile(
            GAMES_JSON_PATH, 
            JSON.stringify(data, null, 2),
            'utf8'
        );
        console.log('✅ 游戏数据已成功保存到games.json');
    } catch (error) {
        console.error('错误：无法保存games.json文件');
        console.error(error);
    }
}

/**
 * 从CSV文件导入游戏
 * @param {string} csvPath CSV文件路径
 */
async function importGamesFromCSV(csvPath) {
    // 加载现有游戏数据
    const gamesData = await loadGamesJson();
    
    // 检查CSV文件是否存在
    if (!fs.existsSync(csvPath)) {
        console.error(`错误：CSV文件 "${csvPath}" 不存在`);
        process.exit(1);
    }
    
    // 创建readline接口
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let lineCount = 0;
    let importedCount = 0;
    let headerLine = '';
    
    console.log(`开始从 "${csvPath}" 导入游戏数据...\n`);
    
    // 逐行读取CSV
    for await (const line of rl) {
        // 跳过空行
        if (!line.trim()) continue;
        
        // 第一行是标题行
        if (lineCount === 0) {
            headerLine = line;
            console.log(`CSV标题行: ${headerLine}`);
            lineCount++;
            continue;
        }
        
        try {
            // 解析游戏数据
            const game = parseGameFromCSV(line);
            
            // 检查必填字段
            if (!game.title || !game.description || !game.iframeUrl || !game.category) {
                console.warn(`警告：第${lineCount}行缺少必填字段，已跳过`);
                lineCount++;
                continue;
            }
            
            // 检查分类是否存在
            const categoryExists = gamesData.categories.some(c => c.id === game.category);
            if (!categoryExists) {
                console.warn(`警告：游戏 "${game.title}" 使用了未知分类 "${game.category}"，已跳过`);
                lineCount++;
                continue;
            }
            
            // 检查ID是否已存在
            const existingGameIndex = gamesData.games.findIndex(g => g.id === game.id);
            if (existingGameIndex >= 0) {
                console.log(`游戏ID "${game.id}" 已存在，正在更新...`);
                gamesData.games[existingGameIndex] = game;
            } else {
                // 添加新游戏
                gamesData.games.push(game);
                console.log(`添加新游戏: ${game.title} (ID: ${game.id})`);
            }
            
            importedCount++;
        } catch (error) {
            console.error(`处理第${lineCount}行时出错: ${error.message}`);
        }
        
        lineCount++;
    }
    
    console.log(`\n导入完成！共处理 ${lineCount - 1} 行，成功导入 ${importedCount} 个游戏。`);
    
    // 保存更新后的数据
    await saveGamesJson(gamesData);
}

/**
 * 创建示例CSV文件
 * @param {string} outputPath 输出文件路径
 */
async function createSampleCSV(outputPath) {
    const sampleContent = 
`title,description,thumbnailUrl,iframeUrl,category,tags,popularity,instructions,tip1,tip2,tip3
俄罗斯方块,经典的俄罗斯方块游戏，考验你的空间思维和反应速度,https://via.placeholder.com/300x200?text=俄罗斯方块,https://games.example.com/tetris,puzzle,益智|经典,95,使用方向键控制方块，上键旋转，下键加速，空格键直接落下。尽可能多地消除行数获得高分。,提前规划方块的放置位置,保持左侧或右侧的一列干净，便于放置长条,避免在中间留下空洞
贪吃蛇,控制蛇吃食物并不断变长，避免撞墙或咬到自己,https://via.placeholder.com/300x200?text=贪吃蛇,https://games.example.com/snake,action,动作|经典,88,使用方向键控制蛇的移动方向。吃到食物后蛇会变长，碰到墙壁或自己的身体则游戏结束。,尽量保持蛇的活动空间，避免被自己围困,预判食物的位置，提前规划路线,控制好蛇的移动节奏，避免手忙脚乱`;

    try {
        await fs.promises.writeFile(outputPath, sampleContent, 'utf8');
        console.log(`✅ 示例CSV文件已创建: ${outputPath}`);
        console.log('现在你可以修改这个文件，然后运行:');
        console.log(`node import_games.js ${outputPath}`);
    } catch (error) {
        console.error('创建示例文件时出错:', error);
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🎮 游戏批量导入工具\n');
    
    const args = process.argv.slice(2);
    
    // 检查参数
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        console.log('使用方法:');
        console.log('  node import_games.js <CSV文件路径>  - 从CSV文件导入游戏');
        console.log('  node import_games.js --sample       - 创建示例CSV文件');
        return;
    }
    
    // 创建示例文件
    if (args[0] === '--sample') {
        await createSampleCSV(path.join(__dirname, 'games_sample.csv'));
        return;
    }
    
    // 导入CSV
    const csvPath = args[0];
    await importGamesFromCSV(csvPath);
}

// 运行主函数
main().catch(error => {
    console.error('发生错误:', error);
    process.exit(1);
}); 