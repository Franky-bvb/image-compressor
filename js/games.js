/**
 * 游戏数据管理模块
 * 负责加载、过滤和排序游戏数据
 */

const GamesManager = {
    games: [],
    categories: [],
    
    /**
     * 初始化并加载游戏数据
     */
    async init() {
        try {
            const response = await fetch('./data/games.json');
            if (!response.ok) {
                throw new Error('无法加载游戏数据');
            }
            
            const data = await response.json();
            this.games = data.games || [];
            this.categories = data.categories || [];
            
            console.log('游戏数据加载成功', this.games.length);
            return true;
        } catch (error) {
            console.error('加载游戏数据失败:', error);
            return false;
        }
    },
    
    /**
     * 获取所有游戏
     */
    getAllGames() {
        return [...this.games];
    },
    
    /**
     * 按类别获取游戏
     * @param {string} categoryId - 类别ID
     */
    getGamesByCategory(categoryId) {
        if (!categoryId) return this.getAllGames();
        return this.games.filter(game => game.category === categoryId);
    },
    
    /**
     * 获取特定游戏详情
     * @param {string} gameId - 游戏ID
     */
    getGameById(gameId) {
        return this.games.find(game => game.id === gameId);
    },
    
    /**
     * 获取热门游戏
     * @param {number} limit - 返回数量限制
     */
    getFeaturedGames(limit = 8) {
        return [...this.games]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    },
    
    /**
     * 获取最新游戏
     * @param {number} limit - 返回数量限制
     */
    getNewGames(limit = 8) {
        return [...this.games]
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, limit);
    },
    
    /**
     * 搜索游戏
     * @param {string} query - 搜索关键词
     */
    searchGames(query) {
        if (!query) return this.getAllGames();
        
        const lowerQuery = query.toLowerCase();
        return this.games.filter(game => 
            game.title.toLowerCase().includes(lowerQuery) || 
            game.description.toLowerCase().includes(lowerQuery) ||
            game.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },
    
    /**
     * 排序游戏列表
     * @param {Array} games - 游戏列表
     * @param {string} sortBy - 排序方式（popular/newest/name）
     */
    sortGames(games, sortBy = 'popular') {
        const gamesCopy = [...games];
        
        switch (sortBy) {
            case 'popular':
                return gamesCopy.sort((a, b) => b.popularity - a.popularity);
            case 'newest':
                return gamesCopy.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'name':
                return gamesCopy.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return gamesCopy;
        }
    },
    
    /**
     * 获取相关游戏
     * @param {string} gameId - 当前游戏ID
     * @param {number} limit - 返回数量限制
     */
    getRelatedGames(gameId, limit = 4) {
        const currentGame = this.getGameById(gameId);
        if (!currentGame) return [];
        
        // 首先尝试找相同类别的游戏
        const sameCategory = this.games.filter(game => 
            game.id !== gameId && 
            game.category === currentGame.category
        );
        
        // 如果相同类别的游戏不够，添加其他热门游戏
        if (sameCategory.length >= limit) {
            return sameCategory
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, limit);
        } else {
            const otherGames = this.games.filter(game => 
                game.id !== gameId && 
                game.category !== currentGame.category
            )
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit - sameCategory.length);
            
            return [...sameCategory, ...otherGames];
        }
    },
    
    /**
     * 获取类别信息
     * @param {string} categoryId - 类别ID
     */
    getCategoryInfo(categoryId) {
        return this.categories.find(category => category.id === categoryId);
    }
};

// 创建游戏卡片HTML
function createGameCard(game) {
    const categoryInfo = GamesManager.getCategoryInfo(game.category);
    const categoryName = categoryInfo ? categoryInfo.name : game.category;
    
    return `
        <a href="game.html?id=${game.id}" class="game-card bg-white rounded shadow-md hover:shadow-lg overflow-hidden">
            <img src="${game.thumbnailUrl}" alt="${game.title}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg">${game.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${game.description.substring(0, 60)}${game.description.length > 60 ? '...' : ''}</p>
                <div class="flex justify-between items-center">
                    <span class="game-tag game-tag-${game.category}">${categoryName}</span>
                    <span class="text-xs text-gray-500">人气: ${game.popularity}</span>
                </div>
            </div>
        </a>
    `;
} 