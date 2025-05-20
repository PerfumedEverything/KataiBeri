class FiltersPanel {
    selectors = {
      root: '[data-js-filters-panel]',
      overlay: '.filters__panel-overlay',
      toggleButton: '.filters__panel-header-btn',
    }
  
    stateClasses = {
      isActive: 'is-active',
    }
  
    constructor() {
      this.rootElement = document.querySelector(this.selectors.root)
      this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
      this.toggleButton = this.rootElement.querySelector(this.selectors.toggleButton)
      this.bindEvents()
    }
  
    onToggleClick = () => {
      this.toggleButton.classList.toggle(this.stateClasses.isActive)
      this.overlayElement.classList.toggle(this.stateClasses.isActive)
      document.querySelector(this.selectors.lockElement)
    }
  
    bindEvents() {
      this.toggleButton.addEventListener('click', this.onToggleClick)
    }
  }
  
  export default FiltersPanel