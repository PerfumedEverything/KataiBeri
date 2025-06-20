class Filters {
  selectors = {
      root: '[data-js-filters]',
      applyButton: '.filters__apply-button',
      resetButton: '.filters__reset-button',
      filterButton: '.button-filters',
      productItem: '.filters__catalog-item',
      categoryBlock: '.filters__catalog-category',
      group: '.filters__panel-group',
      showToggle: '[data-js-show-toggle]',
      noResults: '[data-js-no-results]'
  };

  stateClasses = {
      active: 'active',
      hidden: 'is-hidden',
      visible: 'is-visible',
      toggled: 'is-toggled'
  };

  maxVisibleItemsPerCategory = 3;

  constructor(filtersPanelInstance) {
      this.filtersPanel = filtersPanelInstance; 
      this.root = document.querySelector(this.selectors.root);
      if (!this.root) return;

      this.isExpanded = false;
      this.initElements();
      this.initBindings();
      this.bindEvents();
      this.initShowMore();
      this.updateFilterCount();
  }

  initElements() {
      this.applyButton = this.root.querySelector(this.selectors.applyButton);
      this.resetButton = this.root.querySelector(this.selectors.resetButton);
      this.filterButtons = this.root.querySelectorAll(this.selectors.filterButton);
      this.productItems = this.root.querySelectorAll(this.selectors.productItem);
      this.categoryBlocks = this.root.querySelectorAll(this.selectors.categoryBlock);
      this.groups = this.root.querySelectorAll(this.selectors.group);
      this.showToggleButton = this.root.querySelector(this.selectors.showToggle);
      this.noResults = this.root.querySelector(this.selectors.noResults);

      this.activeFilters = {
          location: null,
          categories: []
      };
  }

  initBindings() {
      this.handleFilterClick = this.handleFilterClick.bind(this);
      this.applyFilters = this.applyFilters.bind(this);
      this.resetFilters = this.resetFilters.bind(this);
      this.handleShowToggle = this.handleShowToggle.bind(this);
  }

  bindEvents() {
      this.filterButtons.forEach(btn => {
          btn.addEventListener('click', this.handleFilterClick);
      });

      this.applyButton?.addEventListener('click', this.applyFilters);
      this.resetButton?.addEventListener('click', this.resetFilters);
      this.showToggleButton?.addEventListener('click', this.handleShowToggle);
  }

  initShowMore() {
      this.updateVisibility();
      this.updateToggleButton();
  }

  handleShowToggle(event) {
      event.preventDefault();
      this.isExpanded = !this.isExpanded;
      this.updateVisibility();
      this.updateToggleButton();
  }

  updateVisibility() {
      let totalVisibleCount = 0;

      this.categoryBlocks.forEach(block => {
          const blockCategories = block.dataset.filterCategory.split(' ');
          const items = block.querySelectorAll(this.selectors.productItem);
          let visibleCount = 0;

          const categoryMatch = this.activeFilters.categories.length === 0 || 
              blockCategories.some(c => this.activeFilters.categories.includes(c));

          items.forEach((item, index) => {
              const itemLocations = item.dataset.location.split(' ');
              const locationMatch = !this.activeFilters.location || 
                  itemLocations.includes(this.activeFilters.location);

              const isFiltered = categoryMatch && locationMatch;
              const shouldBeVisible = isFiltered && (this.isExpanded || index < this.maxVisibleItemsPerCategory);

              item.classList.toggle(this.stateClasses.hidden, !shouldBeVisible);
              item.classList.toggle(this.stateClasses.visible, shouldBeVisible);
              if (shouldBeVisible) {
                  visibleCount++;
                  totalVisibleCount++;
              }
          });

          block.classList.toggle(this.stateClasses.hidden, visibleCount === 0);
      });

      if (this.noResults) {
          this.noResults.classList.toggle(this.stateClasses.hidden, totalVisibleCount > 0);
          this.noResults.classList.toggle(this.stateClasses.visible, totalVisibleCount === 0);
      }

      if (this.showToggleButton) {
          this.showToggleButton.classList.toggle(this.stateClasses.hidden, totalVisibleCount === 0);
      }
  }

  updateToggleButton() {
      if (!this.showToggleButton) return;
      const totalItems = Array.from(this.productItems).filter(item => {
          const itemLocations = item.dataset.location.split(' ');
          const block = item.closest(this.selectors.categoryBlock);
          const blockCategories = block.dataset.filterCategory.split(' ');

          const locationMatch = !this.activeFilters.location || 
              itemLocations.includes(this.activeFilters.location);
          const categoryMatch = this.activeFilters.categories.length === 0 || 
              blockCategories.some(c => this.activeFilters.categories.includes(c));

          return locationMatch && categoryMatch;
      }).length;

      this.showToggleButton.classList.toggle(
          this.stateClasses.toggled, 
          this.isExpanded
      );
      this.showToggleButton.classList.toggle(
          this.stateClasses.hidden, 
          totalItems <= this.maxVisibleItemsPerCategory * this.categoryBlocks.length || totalItems === 0
      );
  }

  handleFilterClick(event) {
      const button = event.currentTarget;
      const group = button.closest(this.selectors.group);
      const filterType = button.dataset.filter.startsWith('location') 
          ? 'location' 
          : 'category';

      filterType === 'location' 
          ? this.handleLocationFilter(button, group)
          : this.handleCategoryFilter(button, group);
      this.updateFilterCount();
  }

  handleLocationFilter(button, group) {
      const isAll = button.dataset.filter === 'all';

      if (isAll) {
          group.querySelectorAll(this.selectors.filterButton)
              .forEach(btn => btn.classList.remove(this.stateClasses.active));
          button.classList.add(this.stateClasses.active);
      } else {
          if (button.classList.contains(this.stateClasses.active)) {
              button.classList.remove(this.stateClasses.active);
          } else {
              group.querySelectorAll(this.selectors.filterButton)
                  .forEach(btn => btn.classList.remove(this.stateClasses.active));
              button.classList.add(this.stateClasses.active);
          }

          const activeInGroup = Array.from(group.querySelectorAll(this.selectors.filterButton)).filter(
              btn => btn.classList.contains(this.stateClasses.active) && btn.dataset.filter !== 'all'
          );
          if (activeInGroup.length === 0) {
              group.querySelector('[data-filter="all"]')?.classList.add(this.stateClasses.active);
          }
      }
      this.activeFilters.location = button.classList.contains(this.stateClasses.active) && !isAll 
          ? button.dataset.filter 
          : null;
  }

  handleCategoryFilter(button, group) {
      const isAll = button.dataset.filter === 'all';

      if (isAll) {
          group.querySelectorAll(this.selectors.filterButton)
              .forEach(btn => btn.classList.remove(this.stateClasses.active));
          button.classList.add(this.stateClasses.active);
      } else {
          if (button.classList.contains(this.stateClasses.active)) {
              button.classList.remove(this.stateClasses.active);
          } else {
              group.querySelector('[data-filter="all"]')
                  ?.classList.remove(this.stateClasses.active);
              button.classList.add(this.stateClasses.active);
          }
          const activeInGroup = Array.from(group.querySelectorAll(this.selectors.filterButton)).filter(
              btn => btn.classList.contains(this.stateClasses.active) && btn.dataset.filter !== 'all'
          );
          if (activeInGroup.length === 0) {
              group.querySelector('[data-filter="all"]')?.classList.add(this.stateClasses.active);
          }
      }
  }

  updateFilterCount() {
      const activeCategories = Array.from(this.filterButtons).filter(
          button => button.classList.contains(this.stateClasses.active) && 
                  button.dataset.filter.startsWith('category-')
      );

      const activeLocations = Array.from(this.filterButtons).filter(
          button => button.classList.contains(this.stateClasses.active) && 
                  button.dataset.filter.startsWith('location-')
      );

      const count = activeCategories.length + (activeLocations.length > 0 ? 1 : 0);

      if (this.applyButton) {
          this.applyButton.setAttribute('data-filter-count', count);
          if (count === 0) {
              this.applyButton.removeAttribute('data-filter-count');
          }
      }
  }

  applyFilters() {
      this.updateActiveFilters();
      this.isExpanded = false;
      this.updateVisibility();
      this.updateToggleButton();
      this.updateFilterCount();
      if (this.filtersPanel) {
          this.filtersPanel.closePanel();
      }
  }

  updateActiveFilters() {
      const locationButton = this.root.querySelector(
          '[data-filter^="location-"].active, [data-filter="all"].active'
      );
      this.activeFilters.location = 
          locationButton?.dataset.filter === 'all' ? null : locationButton?.dataset.filter;

      const categoryGroup = this.root.querySelector(
          `${this.selectors.group} [data-filter^="category-"]`
      )?.closest(this.selectors.group);
      
      if (categoryGroup && categoryGroup.querySelector('[data-filter="all"].active')) {
          this.activeFilters.categories = [];
      } else if (categoryGroup) {
          this.activeFilters.categories = Array.from(
              categoryGroup.querySelectorAll('[data-filter^="category-"].active')
          ).map(btn => btn.dataset.filter);
      }
  }

  resetFilters() {
      this.groups.forEach(group => {
          group.querySelectorAll(this.selectors.filterButton)
              .forEach(btn => btn.classList.remove(this.stateClasses.active));
          group.querySelector('[data-filter="all"]')
              ?.classList.add(this.stateClasses.active);
      });

      this.activeFilters = { location: null, categories: [] };
      this.isExpanded = false;
      this.updateVisibility();
      this.updateToggleButton();
      this.updateFilterCount();
      if (this.filtersPanel) {
          this.filtersPanel.closePanel();
      }
  }
}

class FiltersPanel {
    selectors = {
        root: '[data-js-filters-panel]',
        overlay: '.filters__panel-overlay',
        toggleButton: '.filters__panel-header-btn',
        header: '.filters__panel-header',
        groups: '.filters__panel-groups',
    };

    stateClasses = {
        isActive: 'is-active',
    };

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
        this.toggleButton = this.rootElement.querySelector(this.selectors.toggleButton);
        this.headerElement = this.rootElement.querySelector(this.selectors.header);
        this.groupsElement = this.rootElement.querySelector(this.selectors.groups);
        this.bindEvents();
    }

    onToggleClick = () => {
        this.toggleButton.classList.toggle(this.stateClasses.isActive);
        this.overlayElement.classList.toggle(this.stateClasses.isActive);
        this.groupsElement.classList.toggle(this.stateClasses.isActive);
    };

    closePanel() {
        this.toggleButton.classList.remove(this.stateClasses.isActive);
        this.overlayElement.classList.remove(this.stateClasses.isActive);
        this.groupsElement.classList.remove(this.stateClasses.isActive);
    }

    bindEvents() {
        this.headerElement.addEventListener('click', this.onToggleClick);
    }
}

export { Filters, FiltersPanel };