'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        tabs.forEach((item, i) => {
            if (target == item) {
                hideTabContent();
                showTabContent(i);
            }
        });
    });

    // Timer
    //const deadline = '2022-08-01';
    const deadline = new Date((new Date()).getTime() + 999999999);


    function getTimeRemaining (endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor(t / (1000 * 60 * 60) % 24);
            minutes = Math.floor(t / (1000 * 60) % 60);
            seconds = Math.floor(t / 1000 % 60);
        }
            
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer' ,deadline);

    // Modal
    const openBtns = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        //modal.style.display = 'none';
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    openBtns.forEach(item => {
        item.addEventListener('click', openModal);
    });

    function closeModal() {
        //modal.style.display = 'none';
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code == 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Menu cards
    class MenuCards {
        constructor (img, alt, name, descr, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.name = name;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        createCard() {
            const newCard = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                newCard.classList.add(this.element);
            } else {
                this.classes.forEach(className => newCard.classList.add(className));
            }

            this.parent.append(newCard);

            newCard.innerHTML = `
                <img src="${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.name}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };
    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCards(img, altimg, title, descr, price, '.menu .container', 'menu__item').createCard();
            });
        });

    // Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-type': 'application/json'
            }
        });

        return await res;
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusIcon = document.createElement('img');
            statusIcon.src = message.loading;
            statusIcon.style.cssText = `
                display: block;
                margin: 0 auto;
                margin-top: 20px;
            `;
            form.insertAdjacentElement('afterend', statusIcon);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                statusIcon.remove();
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        prevModalDialog.classList.remove('show');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <form action="#">
                    <div data-close class="modal__close">&times;</div>
                    <div class="modal__title">${message}</div>
                </form>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 5000);
    }

    // Slider

    const current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesInner = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width,
          slider = document.querySelector('.offer__slider');
    let sliderId = 1;
    let offset = 0;

    slidesWrapper.style.overflow = 'hidden';

    slidesInner.style.width = `${100 * slides.length}%`;
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '0.5s all';

    slider.style.position = 'relative';
    const indicators = document.createElement('div');
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    slides.forEach((slide, i) => {
        slide.style.width = parseInt(width);
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.id = i + 1;
        indicators.append(dot);
        if (dot.id == sliderId) {
            dot.style.opacity = '1';
        }
    });

    const dots = document.querySelectorAll('.dot');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }
    if (sliderId < 10) {
        current.textContent = `0${sliderId}`;
    } else {
        current.textContent = sliderId + 1;
    }

    next.addEventListener('click', () => {
        if (offset == parseInt(width) * (slides.length - 1)) {
            offset = 0;
            dots[sliderId - 1].style.opacity = '.5';
            sliderId = 1;
            dots[sliderId - 1].style.opacity = '1';
        } else {
            offset += parseInt(width);
            dots[sliderId - 1].style.opacity = '.5';
            sliderId += 1;
            dots[sliderId - 1].style.opacity = '1';
        }
        if (sliderId < 10) {
            current.textContent = `0${sliderId}`;
        } else {
            current.textContent = sliderId;
        }
        slidesInner.style.transform = `translateX(-${offset}px)`;
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = parseInt(width) * (slides.length - 1);
            dots[sliderId - 1].style.opacity = '.5';
            sliderId = slides.length;
            dots[sliderId - 1].style.opacity = '1';
        } else {
            offset -= parseInt(width);
            dots[sliderId - 1].style.opacity = '.5';
            sliderId -= 1;
            dots[sliderId - 1].style.opacity = '1';
        }
        if (sliderId < 10) {
            current.textContent = `0${sliderId}`;
        } else {
            current.textContent = sliderId;
        }
        slidesInner.style.transform = `translateX(-${offset}px)`;
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            sliderId = i + 1;
            dots[offset / parseInt(width)].style.opacity = '.5';
            slidesInner.style.transform = `translateX(-${offset = parseInt(width) * (dot.id - 1)}px)`;
            dot.style.opacity = '1';
            if (sliderId < 10) {
                current.textContent = `0${sliderId}`;
            } else {
                current.textContent = sliderId;
            }
        });
    });

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
});