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
    }

    const reviewsSlider = document.querySelector('[data-js-reviews-slider]');
    if (reviewsSlider) {
        new Slider(reviewsSlider, false, true); 
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

    const filtersPanel = document.querySelector('[data-js-filters-panel]') ? new FiltersPanel() : null;
    if (document.querySelector('[data-js-filters]')) new Filters(filtersPanel);

    new Popup();
    new Map();
    if (document.querySelector('.pop-up__input--date')) new DateInput();
});