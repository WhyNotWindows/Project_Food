'use strict';
import forms from './modules/forms';
window.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs'),
          modal = require('./modules/modal'),
          timer = require('./modules/timer'),
          slider = require('./modules/slider'),
          calculator = require('./modules/calculator'),
          cards = require('./modules/cards');

    tabs();
    modal();
    timer();
    slider();
    forms();
    calculator();
    cards();
});