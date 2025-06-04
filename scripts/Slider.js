class Slider {
    constructor(root, isOptionsSlider = false, autoScroll = false) {
        this.root = root;
        if (!this.root) return;

        this.isOptionsSlider = isOptionsSlider; 
        this.list = this.root.querySelector(isOptionsSlider ? '[data-js-options-slider-list]' : '[data-js-reviews-slider-list]');
        this.pagination = this.root.querySelector(isOptionsSlider ? '[data-js-options-slider-pagination]' : '[data-js-reviews-slider-pagination]');
        this.items = [...this.list.querySelectorAll(isOptionsSlider ? '[data-js-options-slider-item]' : '[data-js-reviews-slider-item]')];
        if (!this.list || !this.pagination || !this.items.length) return;

        this.currentIndex = 0;
        this.itemWidth = this.items[0].offsetWidth;
        this.gap = parseInt(getComputedStyle(this.list).gap) || 20;
        this.itemWidthWithGap = this.itemWidth + this.gap;
        this.updateVisibleItems();
        this.isScrolling = false;
        this.autoScroll = autoScroll;
        this.autoScrollInterval = null;
        this.init();
    }

    updateVisibleItems() {
        const windowWidth = window.innerWidth;
        if (windowWidth > 1024) {
            this.visibleItems = 3;
        } else if (windowWidth <= 1024 && windowWidth > 780) {
            this.visibleItems = 2;
        } else {
            this.visibleItems = 1;
        }
    }

    init() {
        this.createPagination();
        this.scrollToCurrent();
        this.updatePagination();

        if (this.autoScroll) {
            this.startAutoScroll();
        }

        this.list.addEventListener('wheel', (e) => {
            if (this.isOptionsSlider && window.innerWidth > 1024) {
                return; 
            }

            e.preventDefault(); 

            if (this.isScrolling) return;
            this.isScrolling = true;

            const direction = e.deltaX > 0 || e.deltaY > 0 ? 'next' : 'prev';
            this.slide(direction);

            setTimeout(() => (this.isScrolling = false), 250);
        }, { passive: false });

        this.list.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            if (this.autoScrollInterval) {
                clearInterval(this.autoScrollInterval);
            }
        });

        this.list.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        });

        this.list.addEventListener('touchend', () => {
            if (this.isScrolling) return;
            const deltaX = this.touchStartX - this.touchEndX;
            if (Math.abs(deltaX) < 50) return;
            this.isScrolling = true;
            this.slide(deltaX > 0 ? 'next' : 'prev');
            setTimeout(() => {
                this.isScrolling = false;
                if (this.autoScroll) this.startAutoScroll();
            }, 250);
        });

        window.addEventListener('resize', () => {
            this.updateVisibleItems();
            this.itemWidth = this.items[0].offsetWidth;
            this.gap = parseInt(getComputedStyle(this.list).gap) || 20;
            this.itemWidthWithGap = this.itemWidth + this.gap;
            this.currentIndex = Math.min(this.currentIndex, this.items.length - this.visibleItems);
            this.createPagination();
            this.scrollToCurrent();
            this.updatePagination();

            if (this.autoScrollInterval) {
                clearInterval(this.autoScrollInterval);
                if (this.autoScroll) this.startAutoScroll();
            }
        });
    }

    startAutoScroll() {
        this.autoScrollInterval = setInterval(() => {
            const maxIndex = this.items.length - this.visibleItems;
            if (this.currentIndex >= maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.scrollToCurrent();
            this.updatePagination();
        }, 5000);
    }

    createPagination() {
        this.pagination.innerHTML = '';
        const maxIndex = Math.max(0, this.items.length - this.visibleItems);
        for (let i = 0; i <= maxIndex; i++) { 
            const dot = document.createElement('button');
            dot.classList.add('reviews__slider-pagination-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.scrollToCurrent();
                this.updatePagination();

                if (this.autoScrollInterval) {
                    clearInterval(this.autoScrollInterval);
                    if (this.autoScroll) this.startAutoScroll();
                }
            });
            this.pagination.appendChild(dot);
        }
    }

    slide(direction) {
        const maxIndex = this.items.length - this.visibleItems;
        this.currentIndex = direction === 'prev' ? Math.max(0, this.currentIndex - 1) : Math.min(maxIndex, this.currentIndex + 1);
        this.scrollToCurrent();
        this.updatePagination();
    }

    scrollToCurrent() {
        const offset = this.currentIndex * this.itemWidthWithGap;
        this.list.style.transform = `translateX(-${offset}px)`;
    }

    updatePagination() {
        const dots = this.pagination.querySelectorAll('.reviews__slider-pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === this.currentIndex);
            dot.disabled = index === this.currentIndex;
        });
    }
}

export default Slider;