class DateInput {
    constructor() {
      this.dateInputs = document.querySelectorAll('.pop-up__input--date');
      this.init();
    }
  
    init() {
      if (this.dateInputs) {
        this.dateInputs.forEach(input => {
          
            input.addEventListener('focus', () => {
            if (input.classList.contains('placeholder')) {
              input.value = '';
              input.classList.remove('placeholder');
            }
          });
  
          input.addEventListener('blur', () => {
            if (!input.value) {
              input.value = "Выберите дату";
              input.classList.add('placeholder');
            }
          });
  
          input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, ''); 
            if (value.length > 8) value = value.slice(0, 8); 
  
            let formattedValue = '';
            if (value.length > 0) {
              formattedValue += value.slice(0, 2); 
              if (value.length > 2) {
                formattedValue += '.' + value.slice(2, 4); 
              }
              if (value.length > 4) {
                formattedValue += '.' + value.slice(4, 8); 
              }
            }
            e.target.value = formattedValue;
  
            const match = formattedValue.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
            if (match) {
              const day = parseInt(match[1], 10);
              const month = parseInt(match[2], 10);
              const year = parseInt(match[3], 10);
              const date = new Date(year, month - 1, day);
              if (
                date.getDate() !== day ||
                date.getMonth() + 1 !== month ||
                date.getFullYear() !== year ||
                year < 1900 ||
                year > 2100
              ) {
                input.setCustomValidity('Неверная дата');
              } else {
                input.setCustomValidity('');
              }
            } else if (formattedValue.length === 10) {
              input.setCustomValidity('Неверная дата');
            } else {
              input.setCustomValidity('');
            }
          });
        });
      }
    }
  }
  
  export default DateInput;