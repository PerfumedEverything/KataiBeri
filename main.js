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

let isScrolling = false; 

function smoothScrollTo(element) {
    if (isScrolling) return; 
    isScrolling = true;

    const start = window.scrollY;
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0; 
    const targetPosition = element.getBoundingClientRect().top + start - headerHeight;
    const duration = 600; 
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeInOutQuad = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, start + (targetPosition - start) * easeInOutQuad);

        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            isScrolling = false;
        }
    }

    requestAnimationFrame(animation);
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
                    smoothScrollTo(target);
                    window.history.pushState(null, null, `#${hash}`);
                } else {
                    console.warn(`Элемент с id="${hash}" не найден`);
                }
            } else if (hash && path !== currentPath) {
                window.location.href = href;
            }
        });
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash && !window.location.hash.includes('no-scroll')) {
        const target = document.getElementById(initialHash);
        if (target) {
            setTimeout(() => smoothScrollTo(target), 100);
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