// DOM 元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentFile = null;
let compressedBlob = null;

// 事件监听器
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#357abd';
    dropZone.style.backgroundColor = '#f8f9fa';
});
dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4a90e2';
    dropZone.style.backgroundColor = '#fff';
});
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
qualitySlider.addEventListener('input', updateQualityValue);
qualitySlider.addEventListener('change', handleCompression);
downloadBtn.addEventListener('click', downloadImage);

// 处理拖放上传
function handleDrop(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#4a90e2';
    dropZone.style.backgroundColor = '#fff';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 处理文件
async function processFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    currentFile = file;
    originalSize.textContent = formatFileSize(file.size);
    
    // 预览原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // 压缩图片
    await handleCompression();
}

// 更新质量显示值
function updateQualityValue() {
    qualityValue.textContent = qualitySlider.value + '%';
}

// 处理图片压缩
async function handleCompression() {
    if (!currentFile) return;

    try {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: Number(qualitySlider.value) / 100
        };

        compressedBlob = await imageCompression(currentFile, options);
        compressedSize.textContent = formatFileSize(compressedBlob.size);
        
        // 预览压缩后的图片
        const reader = new FileReader();
        reader.onload = (e) => {
            compressedPreview.src = e.target.result;
        };
        reader.readAsDataURL(compressedBlob);

        // 启用下载按钮
        downloadBtn.disabled = false;
    } catch (error) {
        console.error('压缩失败:', error);
        alert('图片压缩失败，请重试！');
    }
}

// 下载压缩后的图片
function downloadImage() {
    if (!compressedBlob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    
    // 生成文件名
    const extension = compressedBlob.type.split('/')[1];
    const originalName = currentFile.name.split('.')[0];
    link.download = `${originalName}_compressed.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
} 