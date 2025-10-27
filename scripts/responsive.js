// scripts/responsive.js
class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupTouchInteractions();
        this.setupPerformanceOptimizations();
        this.setupCounterAnimation();
        this.bindEvents();
        
        // Добавляем класс для JavaScript-улучшений
        document.documentElement.classList.add('js-enabled');
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width >= 1440) return 'ultra';
        if (width >= 1200) return 'wide';
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        if (width >= 480) return 'phablet';
        return 'mobile';
    }

    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const mainNav = document.getElementById('mainNav');
        const overlay = document.getElementById('mobileNavOverlay');

        if (navToggle && mainNav) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mainNav.classList.toggle('nav--mobile-open');
                navToggle.classList.toggle('nav-toggle--active');
                overlay?.classList.toggle('mobile-nav-overlay--visible');
                document.body.style.overflow = mainNav.classList.contains('nav--mobile-open') ? 'hidden' : '';
            });

            // Закрытие меню при клике на ссылку
            mainNav.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileNavigation();
                });
            });

            // Закрытие меню при клике на оверлей
            overlay?.addEventListener('click', () => {
                this.closeMobileNavigation();
            });

            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
                    this.closeMobileNavigation();
                }
            });

            // Закрытие меню при нажатии Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileNavigation();
                }
            });
        }
    }

    closeMobileNavigation() {
        const mainNav = document.getElementById('mainNav');
        const navToggle = document.getElementById('navToggle');
        const overlay = document.getElementById('mobileNavOverlay');

        mainNav?.classList.remove('nav--mobile-open');
        navToggle?.classList.remove('nav-toggle--active');
        overlay?.classList.remove('mobile-nav-overlay--visible');
        document.body.style.overflow = '';
    }

    setupTouchInteractions() {
        // Улучшенная обработка тач-событий
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Предотвращение масштабирования при двойном тапе
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Улучшение производительности для тач-устройств
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }

    setupPerformanceOptimizations() {
        // Lazy loading для изображений
        this.setupLazyLoading();
        
        // Отложенная загрузка не критичных ресурсов
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.loadNonCriticalResources();
            });
        } else {
            setTimeout(() => this.loadNonCriticalResources(), 1000);
        }
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Добавляем плавное появление
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    loadNonCriticalResources() {
        // Загрузка веб-шрифтов
        const webFonts = document.createElement('link');
        webFonts.rel = 'stylesheet';
        webFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        document.head.appendChild(webFonts);
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-card__number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.round(current);
        }, 16);
    }

    bindEvents() {
        // Ресайз с троттлингом
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Ориентация устройства
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Load event
        window.addEventListener('load', () => {
            this.onPageLoad();
        });
    }

    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
        
        // Обновляем высоту видимой области для мобильных устройств
        this.updateViewportHeight();
    }

    updateViewportHeight() {
        // Устанавливаем кастомное свойство для высоты видимой области
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    onBreakpointChange(breakpoint) {
        console.log(`Breakpoint changed to: ${breakpoint}`);
        
        // Обновляем классы на body для CSS-хуков
        document.body.className = document.body.className.replace(/\bis-\w+\b/g, '');
        document.body.classList.add(`is-${breakpoint}`);
        
        // Специфичные действия при смене брейкпоинта
        switch(breakpoint) {
            case 'mobile':
                this.optimizeForMobile();
                break;
            case 'tablet':
                this.optimizeForTablet();
                break;
            case 'desktop':
                this.optimizeForDesktop();
                break;
        }
    }

    optimizeForMobile() {
        // Закрываем мобильное меню при переходе на больший экран
        this.closeMobileNavigation();
    }

    optimizeForTablet() {
        // Оптимизации для планшетов
    }

    optimizeForDesktop() {
        // Оптимизации для десктопа
    }

    onPageLoad() {
        // Добавляем класс для анимаций после загрузки
        document.body.classList.add('page-loaded');
        
        // Обновляем высоту видимой области
        this.updateViewportHeight();
        
        // Инициализируем прогресс-бары
        this.animateSkillBars();
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill__progress-bar');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    
                    skillObserver.unobserve(bar);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveManager();
});

// Fallback для старых браузеров
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported');
    // Показываем все элементы сразу
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('fade-in-visible');
    });
    
    // Анимируем счетчики сразу
    document.querySelectorAll('.stat-card__number').forEach(counter => {
        counter.textContent = counter.dataset.count;
    });
}

