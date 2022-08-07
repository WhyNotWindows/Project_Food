function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // Slider

    const current = document.querySelector(currentCounter),
    total = document.querySelector(totalCounter),
    prev = document.querySelector(prevArrow),
    next = document.querySelector(nextArrow),
    slides = document.querySelectorAll(slide),
    slidesWrapper = document.querySelector(wrapper),
    slidesInner = document.querySelector(field),
    width = window.getComputedStyle(slidesWrapper).width,
    slider = document.querySelector(container);
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
}

export default slider;