import Header from './scripts/Header.js';
import Slider from './scripts/Slider.js';
import { Filters, FiltersPanel } from './scripts/Filters.js';
import Popup from './scripts/Popup.js';
import Map from './scripts/Map.js';
import DateInput from './scripts/DateInput.js';

function initSliders() {
    const optionsSlider = document.querySelector('[data-js-options-slider]');
    if (optionsSlider) {
        new Slider(optionsSlider, true);
    } else {
        console.warn('Элемент слайдера опций не найден');
    }

    const reviewsSlider = document.querySelector('[data-js-reviews-slider]');
    if (reviewsSlider) {
        new Slider(reviewsSlider, false);
    } else {
        console.warn('Элемент слайдера отзывов не найден');
    }
}

function initAccordion() {
    document.querySelectorAll('.questions__accordion').forEach(details => {
        details.addEventListener('toggle', () => {
            const item = details.closest('.questions__item');
            if (details.open) {
                item.setAttribute('has-open', '');
            } else {
                item.removeAttribute('has-open');
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            const [path, hash] = href.split('#');
            const currentPath = window.location.pathname;

            if (hash && (path === '' || path === currentPath || path === '/')) {
                event.preventDefault();
                const target = document.getElementById(hash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    window.history.pushState(null, null, `#${hash}`);
                } else {
                    console.warn(`Элемент с id="${hash}" не найден`);
                }
            }
        });
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const target = document.getElementById(initialHash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initAccordion();
    initSmoothScroll();

    if (document.querySelector('[data-js-header]')) new Header();
    
    const filtersPanel = document.querySelector('[data-js-filters-panel]') ? new FiltersPanel() : null;
    if (document.querySelector('[data-js-filters]')) new Filters(filtersPanel);
    
    new Popup();
    new Map();
    if (document.querySelector('.pop-up__input--date')) new DateInput();
});