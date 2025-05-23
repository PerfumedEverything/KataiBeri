import Header from './scripts/Header.js';
import Slider from './scripts/Slider.js';
import Filters from './scripts/Filters.js';
import FiltersPanel from './scripts/FiltersPanel.js';
import Popup from './scripts/Popup.js';
import Map from './scripts/Map.js';
import DateInput from './scripts/DateInput.js';

function initSliders() {
    const optionsSlider = document.querySelector('[data-js-options-slider]');
    if (!optionsSlider) {
        console.error('Options slider element not found');
    } else {
        new Slider(optionsSlider, true);
    }

    const reviewsSlider = document.querySelector('[data-js-reviews-slider]');
    if (!reviewsSlider) {
        console.error('Reviews slider element not found');
    } else {
        new Slider(reviewsSlider, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSliders();

    if (document.querySelector('[data-js-header]')) new Header();
    if (document.querySelector('[data-js-filters]')) new Filters();
    if (document.querySelector('[data-js-filters-panel]')) new FiltersPanel();
    new Popup();
    new Map();
    if (document.querySelector('.pop-up__input--date')) new DateInput();
});

// Проверка для динамической загрузки
setTimeout(() => {
    initSliders();
}, 5000);