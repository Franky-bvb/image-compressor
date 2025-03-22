/**
 * 分类页功能实现
 */

// 存储当前分类信息和游戏列表
let currentCategory = '';
let filteredGames = [];
let currentPage = 1;
const gamesPerPage = 12;

document.addEventListener('DOMContentLoaded', async function() {
    // 初始化游戏数据
    const dataLoaded = await GamesManager.init();
    if (!dataLoaded) {
        showErrorMessage('无法加载游戏数据，请刷新页面重试。');
        return;
    }
    
    // 获取分类ID
    currentCategory = Router.getQueryParam('type');
    
    // 加载分类信息和游戏
    loadCategoryInfo();
    loadCategoryGames();
    
    // 排序选项变更处理
    const sortOptions = document.getElementById('sortOptions');
    if (sortOptions) {
        sortOptions.addEventListener('change', function() {
            loadCategoryGames();
        });
    }
    
    // 分页按钮处理
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                renderGames();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                renderGames();
            }
        });
    }
});

/**
 * 加载分类信息
 */
function loadCategoryInfo() {
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    if (!currentCategory) {
        // 如果没有指定分类，显示所有游戏
        if (categoryTitle) categoryTitle.textContent = '所有游戏';
        if (categoryDescription) categoryDescription.textContent = '浏览我们所有的在线游戏';
        document.title = '所有游戏 - 游戏天地';
        return;
    }
    
    // 获取分类信息
    const categoryInfo = GamesManager.getCategoryInfo(currentCategory);
    
    if (categoryInfo) {
        if (categoryTitle) categoryTitle.textContent = categoryInfo.name;
        if (categoryDescription) categoryDescription.textContent = categoryInfo.description;
        document.title = `${categoryInfo.name} - 游戏天地`;
    } else {
        // 未找到分类信息
        if (categoryTitle) categoryTitle.textContent = '未知分类';
        if (categoryDescription) categoryDescription.textContent = '未找到该分类的相关信息';
        document.title = '未知分类 - 游戏天地';
    }
}

/**
 * 加载分类游戏
 */
function loadCategoryGames() {
    // 获取游戏列表
    filteredGames = GamesManager.getGamesByCategory(currentCategory);
    
    // 获取排序方式
    const sortOptions = document.getElementById('sortOptions');
    const sortBy = sortOptions ? sortOptions.value : 'popular';
    
    // 排序游戏
    filteredGames = GamesManager.sortGames(filteredGames, sortBy);
    
    // 重置到第一页
    currentPage = 1;
    
    // 更新分页信息
    updatePagination();
    
    // 渲染游戏
    renderGames();
}

/**
 * 渲染游戏列表
 */
function renderGames() {
    const categoryGamesContainer = document.getElementById('categoryGames');
    if (!categoryGamesContainer) return;
    
    // 计算当前页的游戏
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const currentPageGames = filteredGames.slice(startIndex, endIndex);
    
    // 清除任何现有内容
    categoryGamesContainer.innerHTML = '';
    
    if (currentPageGames.length === 0) {
        categoryGamesContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">该分类下暂无游戏</p>';
        return;
    }
    
    // 添加游戏卡片
    currentPageGames.forEach(game => {
        categoryGamesContainer.innerHTML += createGameCard(game);
    });
}

/**
 * 更新分页信息
 */
function updatePagination() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    
    const totalPages = Math.max(1, Math.ceil(filteredGames.length / gamesPerPage));
    
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
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