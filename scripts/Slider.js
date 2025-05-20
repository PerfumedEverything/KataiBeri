class Slider {
    constructor(root, isOptionsSlider = false) {
        this.root = root
        if (!this.root) return

        this.list = this.root.querySelector('[data-js-slider-list]')
        this.pagination = this.root.querySelector('[data-js-slider-pagination]')

        this.isOptionsSlider = isOptionsSlider
        this.currentIndex = 0
        this.itemWidth = 0
        this.visibleItems = 1
        this.gap = 0
        this.isScrolling = false

        this.updateItems()
        this.init()
        this.observeDOM()
    }

    updateItems() {
        this.items = [...this.root.querySelectorAll('[data-js-slider-item]')]
        if (!this.list || !this.items.length) return false
        return true
    }

    observeDOM() {
        const observer = new MutationObserver(() => {
            if (this.updateItems()) {
                this.updateDimensions()
                this.createPagination()
                this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.items.length - this.visibleItems))
                this.scrollToCurrent()
                this.updatePagination()
            } else {
                if (this.pagination) this.pagination.innerHTML = ''
            }
        })
        observer.observe(this.list, { childList: true, subtree: true })
    }

    init() {
        if (!this.items.length) return
        if (this.isOptionsSlider && window.innerWidth > 1024) {
            this.list.scrollTo({ left: 0 })
            if (this.pagination) this.pagination.innerHTML = ''
            return
        }

        this.updateDimensions()
        this.createPagination()
        this.updatePagination()

        this.list.addEventListener('wheel', (e) => {
            if (!e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) return
            if (this.isScrolling) return
            this.isScrolling = true
            this.slide(e.deltaX > 0 || e.deltaY > 0 ? 'next' : 'prev')
            setTimeout(() => this.isScrolling = false, 300)
        })

        this.list.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX
        })

        this.list.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX
        })

        this.list.addEventListener('touchend', () => {
            if (this.isScrolling) return
            const deltaX = this.touchStartX - this.touchEndX
            if (Math.abs(deltaX) < 50) return
            this.isScrolling = true
            this.slide(deltaX > 0 ? 'next' : 'prev')
            setTimeout(() => this.isScrolling = false, 300)
        })

        window.addEventListener('resize', () => {
            if (this.isOptionsSlider && window.innerWidth > 1024) {
                this.list.scrollTo({ left: 0 })
                if (this.pagination) this.pagination.innerHTML = ''
                return
            }
            this.updateDimensions()
            this.createPagination()
            this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.items.length - this.visibleItems))
            this.scrollToCurrent()
            this.updatePagination()
        })
    }

    updateDimensions() {
        this.visibleItems = this.isOptionsSlider ? 1 :
                           window.innerWidth > 1024 ? 3 :
                           window.innerWidth > 768 ? 2 : 1
        this.gap = parseInt(getComputedStyle(this.list).gap) || 20
        this.itemWidth = this.items[0] ? this.items[0].getBoundingClientRect().width + this.gap : 0
    }

    createPagination() {
        if (!this.pagination) return
        this.pagination.innerHTML = ''
        const pageCount = this.isOptionsSlider ? Math.ceil(this.items.length / this.visibleItems) :
                         Math.max(1, this.items.length - this.visibleItems + 1)
        if (pageCount <= 1) return

        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement('button')
            dot.classList.add(this.isOptionsSlider ? 'options__slider-pagination-dot' : 'reviews__slider-pagination-dot')
            dot.type = 'button'
            dot.setAttribute('aria-label', `Slide ${i + 1}`)
            dot.addEventListener('click', () => {
                this.currentIndex = i
                this.scrollToCurrent()
                this.updatePagination()
            })
            this.pagination.appendChild(dot)
        }
    }

    slide(direction) {
        const maxIndex = this.isOptionsSlider ? Math.ceil(this.items.length / this.visibleItems) - 1 :
                         Math.max(0, this.items.length - this.visibleItems)
        this.currentIndex = direction === 'prev' ?
                            Math.max(0, this.currentIndex - 1) :
                            Math.min(maxIndex, this.currentIndex + 1)
        this.updateDimensions()
        this.scrollToCurrent()
        this.updatePagination()
    }

    scrollToCurrent() {
        if (!this.items.length) return
        this.list.scrollTo({
            left: this.currentIndex * this.itemWidth,
            behavior: 'smooth'
        })
    }

    updatePagination() {
        if (!this.pagination) return
        const dots = this.pagination.querySelectorAll(`.${this.isOptionsSlider ? 'options__slider-pagination-dot' : 'reviews__slider-pagination-dot'}`)
        const expectedDots = this.isOptionsSlider ? Math.ceil(this.items.length / this.visibleItems) :
                            Math.max(1, this.items.length - this.visibleItems + 1)
        if (dots.length !== expectedDots) {
            this.createPagination()
            return
        }
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === this.currentIndex)
            dot.disabled = index === this.currentIndex
        })
    }
}

export default Slider;