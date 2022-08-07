function calculator() {
    // Calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        height, weight, age,
        activity = 1.375;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        localStorage.setItem('sex', sex);
    }
    if(localStorage.getItem('activity')) {
        activity = localStorage.getItem('activity');
    } else {
        localStorage.setItem('activity', activity);
    }

    function initiateButtons(selector, activityClass) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach((btn) => {
            btn.classList.remove(activityClass);
            if (btn.getAttribute('id') === localStorage.getItem('sex')) {
                btn.classList.add(activityClass);
            }
            if (btn.getAttribute('data-activity') === localStorage.getItem('activity')) {
                btn.classList.add(activityClass);
            }
        });   
    }

    initiateButtons('#gender div', 'calculating__choose-item_active');
    initiateButtons('.calculating__choose_big div', 'calculating__choose-item_active');

    function calculate() {
        if (sex && height && weight && age && activity) {
            if (sex == 'female') {
                result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * activity);
                return;
            } else {
                result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * activity);
                return;
            }
        } else {
            result.textContent = '____';
        }
    }

    calculate();

    function getStaticInformation(selector, activityClass) {
        const chooseItems = document.querySelectorAll(selector);

        chooseItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-activity')) {
                    activity = +e.target.getAttribute('data-activity');
                    localStorage.setItem('activity', +e.target.getAttribute('data-activity'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                chooseItems.forEach((btn) => {
                    btn.classList.remove(activityClass);
                });
                e.target.classList.add(activityClass);
                calculate();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (e) => {
            if(input.value.match(/\D/)){
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calculate();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

export default calculator;