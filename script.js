// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 显示信件动画
    showLettersSequentially();
    
    // 添加爱心点击事件
    const heart = document.querySelector('.heart');
    heart.addEventListener('click', createHeartBurst);
    
    // 添加星星背景
    createStars();
});

// 依次显示信件内容
function showLettersSequentially() {
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add('show');
        }, (index + 1) * 1000);
    });
}

// 显示最终消息
function revealMessage() {
    const finalMessage = document.getElementById('finalMessage');
    const revealBtn = document.querySelector('.reveal-btn');
    const heartContainer = document.querySelector('.heart-container');
    
    // 隐藏按钮
    revealBtn.style.display = 'none';
    
    // 爱心爆炸效果
    createHeartExplosion();
    
    // 显示最终消息
    setTimeout(() => {
        finalMessage.style.display = 'block';
        finalMessage.scrollIntoView({ behavior: 'smooth' });
        
        // 创建更多漂浮爱心
        createExtraFloatingHearts();
        
        // 播放背景音乐（可选）
        playBackgroundMusic();
    }, 1000);
}

// 创建爱心爆炸效果
function createHeartExplosion() {
    const heartContainer = document.querySelector('.heart-container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.innerHTML = '❤️';
        particle.style.cssText = `
            position: absolute;
            font-size: 1.5em;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: explode ${Math.random() * 1 + 1}s ease-out forwards;
            pointer-events: none;
        `;
        
        const angle = (i / 20) * 2 * Math.PI;
        const distance = Math.random() * 200 + 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--endX', endX + 'px');
        particle.style.setProperty('--endY', endY + 'px');
        
        heartContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// 创建额外漂浮爱心
function createExtraFloatingHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['❤️', '💖', '💕', '💗', '💝', '💓', '💞'][Math.floor(Math.random() * 7)];
            heart.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 1.5 + 1}em;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                animation: floatExtra ${Math.random() * 3 + 4}s linear forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        }, i * 300);
    }
}

// 创建星星背景
function createStars() {
    const starsContainer = document.querySelector('.stars');
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        
        starsContainer.appendChild(star);
    }
}

// 爱心点击效果
function createHeartBurst(event) {
    const heart = event.target;
    
    // 创建点击波纹效果
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 0, 102, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = heart.getBoundingClientRect();
    const size = 100;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.left + rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.top + rect.height / 2 - size / 2) + 'px';
    
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // 创建小爱心
    for (let i = 0; i < 5; i++) {
        const miniHeart = document.createElement('div');
        miniHeart.innerHTML = '💕';
        miniHeart.style.cssText = `
            position: absolute;
            font-size: 1em;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: miniFloat ${Math.random() * 2 + 1}s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(miniHeart);
        setTimeout(() => miniHeart.remove(), 3000);
    }
}

// 播放背景音乐（可选功能）
function playBackgroundMusic() {
    // 如果需要背景音乐，可以取消下面的注释
    // const audio = new Audio('https://example.com/romantic-music.mp3');
    // audio.loop = true;
    // audio.volume = 0.3;
    // audio.play().catch(e => console.log('音乐播放失败:', e));
}

// 添加键盘交互
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        createHeartBurst({ target: document.querySelector('.heart') });
    }
});

// 添加触摸支持（移动设备）
document.addEventListener('touchstart', function(event) {
    if (event.target.classList.contains('heart')) {
        createHeartBurst(event);
    }
});

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面显示时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes explode {
        to {
            transform: translate(calc(-50% + var(--endX)), calc(-50% + var(--endY))) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes floatExtra {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes miniFloat {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -200px) scale(0.5);
            opacity: 0;
        }
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// 响应式处理
window.addEventListener('resize', function() {
    // 重新计算元素位置（如果需要）
    const heartContainer = document.querySelector('.heart-container');
    const container = document.querySelector('.container');
    
    if (window.innerWidth <= 768) {
        heartContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
    } else {
        heartContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

// 预加载动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});