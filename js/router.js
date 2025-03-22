/**
 * 简单的路由器，用于从URL获取参数和处理页面导航
 */

const Router = {
    /**
     * 获取当前URL中的查询参数
     * @param {string} paramName - 参数名
     * @returns {string|null} 参数值或null
     */
    getQueryParam(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    },
    
    /**
     * 生成带参数的URL
     * @param {string} baseUrl - 基础URL
     * @param {Object} params - 参数对象
     * @returns {string} 完整URL
     */
    generateUrl(baseUrl, params = {}) {
        const url = new URL(baseUrl, window.location.origin);
        
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, value);
            }
        }
        
        return url.toString();
    },
    
    /**
     * 导航到指定URL
     * @param {string} url - 目标URL
     */
    navigateTo(url) {
        window.location.href = url;
    },
    
    /**
     * 获取当前页面名称（不含扩展名和查询参数）
     * @returns {string} 页面名称
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.split('.')[0];
    }
};

// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}); 