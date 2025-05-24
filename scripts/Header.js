class Header {
  constructor() {
      this.header = document.querySelector('[data-js-header]');
      this.burger = document.querySelector('[data-js-header-burger-button]');
      this.nav = document.querySelector('[data-js-header-overlay]');
      this.navLinks = document.querySelectorAll('[data-js-menu-item]');

      if (!this.header) {
          console.error('Header element not found');
          return;
      }
      if (!this.burger) {
          console.error('Burger button not found');
          return;
      }
      if (!this.nav) {
          console.error('Navigation overlay not found');
          return;
      }

      this.init();
  }

  init() {
      this.burger.addEventListener('click', () => {
          const isActive = this.nav.classList.toggle('is-active');
          this.burger.classList.toggle('is-active');
          document.body.style.overflow = isActive ? 'hidden' : '';
      });

      window.addEventListener('click', e => {
          if (!e.target.closest('[data-js-header-overlay]') && !e.target.closest('[data-js-header-burger-button]')) {
              this.nav.classList.remove('is-active');
              this.burger.classList.remove('is-active');
              document.body.style.overflow = '';
          }
      });

      this.navLinks.forEach(link => {
          link.addEventListener('click', () => {
              this.nav.classList.remove('is-active');
              this.burger.classList.remove('is-active');
              document.body.style.overflow = '';
          });
      });
  }
}

export default Header;