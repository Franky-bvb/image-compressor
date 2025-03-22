/**
 * 首页功能实现
 */

document.addEventListener('DOMContentLoaded', async function() {
    // 初始化游戏数据
    const dataLoaded = await GamesManager.init();
    if (!dataLoaded) {
        showErrorMessage('无法加载游戏数据，请刷新页面重试。');
        return;
    }
    
    // 加载热门游戏
    loadFeaturedGames();
    
    // 加载最新游戏
    loadNewGames();
});

/**
 * 加载热门游戏
 */
function loadFeaturedGames() {
    const featuredGamesContainer = document.getElementById('featuredGames');
    if (!featuredGamesContainer) return;
    
    const featuredGames = GamesManager.getFeaturedGames(4);
    
    // 清除占位符
    featuredGamesContainer.innerHTML = '';
    
    // 添加游戏卡片
    featuredGames.forEach(game => {
        featuredGamesContainer.innerHTML += createGameCard(game);
    });
}

/**
 * 加载最新游戏
 */
function loadNewGames() {
    const newGamesContainer = document.getElementById('newGames');
    if (!newGamesContainer) return;
    
    const newGames = GamesManager.getNewGames(8);
    
    // 清除任何现有内容
    newGamesContainer.innerHTML = '';
    
    // 添加游戏卡片
    newGames.forEach(game => {
        newGamesContainer.innerHTML += createGameCard(game);
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
    const main = document.querySelector('main');
    if (main && main.firstChild) {
        main.insertBefore(errorDiv, main.firstChild);
    }
} 