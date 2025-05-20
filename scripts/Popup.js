class Popup {
    selectors = {
        popups: '[data-popup]',
        forms: '[data-form]',
        openButtons: '[data-popup-open]',
        closeButton: '[data-popup-close]',
        headerContent: '[data-form-header]',
        inputs: '[data-form-inputs]',
        inputFields: '[data-form-inputs] input',
        successMessage: '[data-form-success]',
        submitButton: '[data-form-submit]',
        homeButton: '[data-form-home]',
        agreement: '[data-form-agreement]',
        formButton: '.form-button'
    };

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
        hidden: 'is-hidden',
        visible: 'is-visible'
    };

    constructor() {
        this.popups = document.querySelectorAll(this.selectors.popups);
        this.forms = document.querySelectorAll(this.selectors.forms);
        this.openButtons = document.querySelectorAll(this.selectors.openButtons);
        console.log('Popups found:', this.popups.length);
        console.log('Forms found:', this.forms.length);
        this.bindEvents();
    }

    bindEvents() {
        this.openButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const popupId = button.dataset.popupOpen === 'want-to-ride' ? 'want-to-ride-popup' : 'rent-popup';
                const popup = document.getElementById(popupId);
                if (!popup) {
                    console.warn(`Popup with ID ${popupId} not found`);
                    return;
                }
                this.openPopup(popup);
            });
        });

        this.popups.forEach(popup => {
            const closeButton = popup.querySelector(this.selectors.closeButton);
            closeButton?.addEventListener('click', () => this.closePopup(popup));

            popup.addEventListener('click', (e) => {
                if (e.target === popup) this.closePopup(popup);
            });
        });

        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        });
    }

    openPopup(popup) {
        popup.classList.add(this.stateClasses.isActive);
        document.documentElement.classList.add(this.stateClasses.isLock);
    }

    closePopup(popup) {
        popup.classList.remove(this.stateClasses.isActive);
        document.documentElement.classList.remove(this.stateClasses.isLock);
        const form = popup.querySelector(this.selectors.forms);
        const headerContent = popup.querySelector(this.selectors.headerContent);
        const inputs = popup.querySelector(this.selectors.inputs);
        const inputFields = popup.querySelectorAll(this.selectors.inputFields);
        const successMessage = popup.querySelector(this.selectors.successMessage);
        const submitButton = popup.querySelector(this.selectors.submitButton) || popup.querySelector(this.selectors.formButton);
        const homeButton = popup.querySelector(this.selectors.homeButton);
        const agreement = popup.querySelector(this.selectors.agreement);
        form?.reset();
        if (headerContent) {
            headerContent.classList.remove(this.stateClasses.hidden);
            headerContent.classList.add(this.stateClasses.visible);
        }
        if (inputs) {
            inputs.classList.remove(this.stateClasses.hidden);
            inputs.classList.add(this.stateClasses.visible);
        }
        inputFields.forEach(input => input.removeAttribute('disabled'));
        if (successMessage) {
            successMessage.classList.add(this.stateClasses.hidden);
            successMessage.classList.remove(this.stateClasses.visible);
        }
        if (submitButton) {
            submitButton.classList.remove(this.stateClasses.hidden);
            submitButton.classList.add(this.stateClasses.visible);
        }
        if (homeButton) {
            homeButton.classList.add(this.stateClasses.hidden);
            homeButton.classList.remove(this.stateClasses.visible);
        }
        if (agreement) {
            agreement.classList.remove(this.stateClasses.hidden);
            agreement.classList.add(this.stateClasses.visible);
        }
    }

    handleFormSubmit(e, form) {
        e.preventDefault();
        const headerContent = form.querySelector(this.selectors.headerContent);
        const inputs = form.querySelector(this.selectors.inputs);
        const inputFields = form.querySelectorAll(this.selectors.inputFields);
        const successMessage = form.querySelector(this.selectors.successMessage);
        const submitButton = form.querySelector(this.selectors.submitButton) || form.querySelector(this.selectors.formButton);
        const homeButton = form.querySelector(this.selectors.homeButton);
        const agreement = form.querySelector(this.selectors.agreement);
        const isPopupForm = form.closest(this.selectors.popups);

        console.log('Form submitted:', form);
        console.log('Is popup form:', !!isPopupForm);
        console.log('Header content found:', headerContent);
        console.log('Inputs found:', inputs);
        console.log('Input fields found:', inputFields.length);
        console.log('Agreement found:', agreement);
        console.log('Success message found:', successMessage);
        console.log('Submit button found:', submitButton);

        console.log('Form data:', new FormData(form));

        if (headerContent) {
            headerContent.classList.add(this.stateClasses.hidden);
            headerContent.classList.remove(this.stateClasses.visible);
        }
        if (inputs) {
            inputs.classList.add(this.stateClasses.hidden);
            inputs.classList.remove(this.stateClasses.visible);
            if (!isPopupForm) {
                inputFields.forEach(input => input.setAttribute('disabled', 'true'));
            }
        }
        if (agreement) {
            agreement.classList.add(this.stateClasses.hidden);
            agreement.classList.remove(this.stateClasses.visible);
        }
        if (successMessage) {
            successMessage.classList.remove(this.stateClasses.hidden);
            successMessage.classList.add(this.stateClasses.visible);
        }
        if (submitButton) {
            submitButton.classList.add(this.stateClasses.hidden);
            submitButton.classList.remove(this.stateClasses.visible);
        }
        if (homeButton) {
            homeButton.classList.remove(this.stateClasses.hidden);
            homeButton.classList.add(this.stateClasses.visible);
        }
    }
}

export default Popup;