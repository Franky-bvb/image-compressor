/**
 * 游戏详情页功能实现
 */

document.addEventListener('DOMContentLoaded', async function() {
    // 初始化游戏数据
    const dataLoaded = await GamesManager.init();
    if (!dataLoaded) {
        showErrorMessage('无法加载游戏数据，请刷新页面重试。');
        return;
    }
    
    // 获取游戏ID
    const gameId = Router.getQueryParam('id');
    if (!gameId) {
        showErrorMessage('未指定游戏ID，无法显示游戏内容。');
        return;
    }
    
    // 加载游戏详情
    loadGameDetails(gameId);
    
    // 加载相关游戏
    loadRelatedGames(gameId);
});

/**
 * 加载游戏详情
 * @param {string} gameId - 游戏ID
 */
function loadGameDetails(gameId) {
    const game = GamesManager.getGameById(gameId);
    if (!game) {
        showErrorMessage('找不到指定的游戏。');
        return;
    }
    
    // 设置页面标题
    document.title = `${game.title} - 游戏天地`;
    
    // 更新页面元数据
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', game.description);
    }
    
    // 显示游戏内容，隐藏加载占位符
    const gameLoading = document.getElementById('gameLoading');
    const gameContent = document.getElementById('gameContent');
    
    if (gameLoading) gameLoading.classList.add('hidden');
    if (gameContent) gameContent.classList.remove('hidden');
    
    // 填充游戏信息
    document.getElementById('gameTitle').textContent = game.title;
    document.getElementById('gameDescription').textContent = game.description;
    document.getElementById('gameInstructions').textContent = game.instructions;
    
    // 创建游戏iframe
    const gameFrame = document.getElementById('gameFrame');
    gameFrame.innerHTML = `
        <iframe src="${game.iframeUrl}" class="game-iframe" allowfullscreen></iframe>
    `;
    
    // 填充游戏技巧
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = '';
    if (game.tips && game.tips.length > 0) {
        game.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    } else {
        document.getElementById('gameTips').classList.add('hidden');
    }
}

/**
 * 加载相关游戏
 * @param {string} gameId - 当前游戏ID
 */
function loadRelatedGames(gameId) {
    const relatedGamesContainer = document.getElementById('relatedGames');
    if (!relatedGamesContainer) return;
    
    const relatedGames = GamesManager.getRelatedGames(gameId, 4);
    
    // 清除任何现有内容
    relatedGamesContainer.innerHTML = '';
    
    if (relatedGames.length === 0) {
        relatedGamesContainer.innerHTML = '<p class="text-gray-500">没有找到相关游戏</p>';
        return;
    }
    
    // 添加游戏卡片
    relatedGames.forEach(game => {
        relatedGamesContainer.innerHTML += createGameCard(game);
    });
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    // 创建错误消息元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.setAttribute('role', 'alert');
    
    errorDiv.innerHTML = `
        <strong class="font-bold">错误!</strong>
        <span class="block sm:inline">${message}</span>
    `;
    
    // 添加到页面顶部
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) {
        // 隐藏加载占位符
        const gameLoading = document.getElementById('gameLoading');
        if (gameLoading) gameLoading.classList.add('hidden');
        
        // 添加错误消息
        gameContainer.prepend(errorDiv);
    }
} 