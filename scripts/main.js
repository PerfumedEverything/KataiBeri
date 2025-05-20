import Header from './Header.js';
import Slider from './Slider.js';
import Filters from './Filters.js';
import FiltersPanel from './FiltersPanel.js';
import Popup from './Popup.js';
import Map from './Map.js';

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
});