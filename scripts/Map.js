export default class Map {
    constructor() {
        this.mapContainer = document.querySelector('#yandex-map');
        if (!this.mapContainer) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadYandexMapAPI();
                observer.disconnect();
            }
        });
        observer.observe(this.mapContainer);
    }

    loadYandexMapAPI() {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        script.onload = () => ymaps.ready(() => this.initMap());
        document.head.appendChild(script);
    }

    initMap() {
        this.myMap = new ymaps.Map(this.mapContainer, {
            center: [48.7326, 44.5432],
            zoom: 12,
            controls: ['zoomControl']
        });

        const locations = [
            {
                coords: [48.7326, 44.5432],
                label: 'ЦПКиО',
                description: 'Пн-Пт: 9:00-19:00<br>Сб-Вс: 9:00-21:00'
            },
            {
                coords: [48.7028, 44.5295],
                label: 'Чуйкова',
                description: 'Пн-Пт: 9:00-19:00<br>Сб-Вс: 9:00-21:00'
            }
        ];

        locations.forEach(location => {
            const placemark = new ymaps.Placemark(location.coords, {
                balloonContent: `<strong>${location.label}</strong><br>${location.description}`
            }, {
                preset: 'islands#redDotIcon'
            });
            this.myMap.geoObjects.add(placemark);
        });

        const buttons = document.querySelectorAll('.map__aside-container');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const lat = parseFloat(button.dataset.lat);
                const lon = parseFloat(button.dataset.lon);
                this.myMap.setCenter([lat, lon], 15, {
                    duration: 300
                });
            });
        });

        if (buttons.length > 0) {
            buttons[0].classList.add('active');
        }

        setTimeout(() => {
            this.myMap.container.fitToViewport();
        }, 100);
    }
}