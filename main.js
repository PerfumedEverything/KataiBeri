import Header from './scripts/Header.js';
import Slider from './scripts/Slider.js';
import Filters from './scripts/Filters.js';
import FiltersPanel from './scripts/FiltersPanel.js';
import Popup from './scripts/Popup.js';
import Map from './scripts/Map.js';
import DateInput from './scripts/DateInput.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-js-header]')) new Header();

    const optionsSlider = document.querySelector('.options-slider[data-js-slider]');
    if (optionsSlider) new Slider(optionsSlider, true);

    const reviewsSlider = document.querySelector('.reviews__slider[data-js-slider]');
    if (reviewsSlider) new Slider(reviewsSlider, false);

    if (document.querySelector('[data-js-filters]')) new Filters();
    if (document.querySelector('[data-js-filters-panel]')) new FiltersPanel();
    new Popup();
    new Map();
    if (document.querySelector('.pop-up__input--date')) new DateInput();
});