class Header {
    constructor() {
      this.header = document.querySelector('[data-js-header]');
      this.burger = document.querySelector('[data-js-header-burger-button]');
      this.nav = document.querySelector('[data-js-header-overlay]');
      this.navLinks = document.querySelectorAll('[data-js-menu-item]');
      this.init();
    }
  
    init() {
      if (this.header) {
        this.burger.addEventListener('click', () => {
          this.nav.classList.toggle('is-active');
          this.burger.classList.toggle('is-active');
        });
  
        window.addEventListener('click', e => {
          if (!e.target.closest('[data-js-header-overlay]') && !e.target.closest('[data-js-header-burger-button]')) {
            this.nav.classList.remove('is-active');
            this.burger.classList.remove('is-active');
          }
        });
  
        this.navLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.nav.classList.remove('is-active');
            this.burger.classList.remove('is-active');
          });
        });
      }
    }
  }
  
  export default Header;