import Header from './scripts/Header.js';
import Slider from './scripts/Slider.js';
import Filters from './scripts/Filters.js';
import FiltersPanel from './scripts/FiltersPanel.js';
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
                item.setAttribute('is-open', '');
            } else {
                item.removeAttribute('is-open');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initAccordion();

    if (document.querySelector('[data-js-header]')) new Header();
    if (document.querySelector('[data-js-filters]')) new Filters();
    if (document.querySelector('[data-js-filters-panel]')) new FiltersPanel();
    new Popup();
    new Map();
    if (document.querySelector('.pop-up__input--date')) new DateInput();
});