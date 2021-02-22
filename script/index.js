document.addEventListener('DOMContentLoaded', () => {
  const [body] = document.getElementsByTagName('body');
  const alertLiveregion = document.querySelector('#alertLiveregion');
  const modal = document.querySelector('#modal');
  const modalMask = document.querySelector('#modalMask');
  const modalOpenBtn = document.querySelector('#modalOpen');
  const modalHeading = document.querySelector('#modalHeading');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');
  const loginForm = document.querySelector('#loginForm');
  const loginFormLiveregion = document.querySelector('#loginFormLiveregion');
  const eventsContainer = document.querySelector('#eventsContainer');
  const eventsFilterForm = document.querySelector('#eventsFilterForm');
  const eventsLiveregion = document.querySelector('#eventsLiveregion');
  const museumSectionTabList = document.querySelector('#museumSectionTablist');
  const museumSectionContent = document.querySelector('#museumSectionContent');
  const subscriptionForm = document.querySelector('#subscriptionForm');
  const subscriptionBtn = subscriptionForm.querySelector('#subscriptionFormSubmit');

  const KEYS = {
    ESC: 'Escape',
    TAB: 'Tab',
  };

  // MODAL
  let previousActiveElement;

  modalOpenBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  loginForm.addEventListener('submit', submitLogin);

  function openModal() {
    previousActiveElement = document.activeElement;
    Array.from(document.body.children).forEach(child => {
      if (child !== modal) child.inert = true;
    });

    modal.style.display = 'block';
    modalMask.addEventListener('click', closeModal);
    document.addEventListener('keydown', checkCloseDialog);
    modal.focus();
  }

  function closeModal() {
    modalMask.removeEventListener('click', closeModal);
    document.removeEventListener('keydown', checkCloseDialog);
    Array.from(document.body.children).forEach(child => {
      child.inert = false;
    });

    loginFormLiveregion.innerHTML = '';
    modal.style.display = 'none';
    
    previousActiveElement.focus();
  }
  
  function submitLogin(e) {
    e.preventDefault();
    const { login, password } = parseFormData(e.target);
    loginFormLiveregion.classList.remove('form__error');
    loginFormLiveregion.style.display = 'block';
    loginFormLiveregion.innerHTML = "<h4>Загрузка ...</h4>";
    Array.from(e.target.elements).forEach(formEl => formEl.disabled = true);
    
    setTimeout(() => {
      Array.from(e.target.elements).forEach(formEl => formEl.disabled = false);
      if (login !== 'test' || password !== 'test') {
        loginFormLiveregion.classList.add('form__error');
        loginFormLiveregion.innerHTML = `
          <h4>Мы не смогли обработать эту форму из-за ошибок:</h4>
          <ul>
            <li>Неверный логин или пароль.</li>
            <li>Подсказка: введите латиницей слово "test" в поле логина и пароля.</li>
          <ul>
        `;
      } else {
        loginFormLiveregion.style.display = 'none';
        alertLiveregion.textContent = 'Вы успешно зашли в аккаунт!';
        alertLiveregion.style.display = "block";
        setTimeout(() => {
          alertLiveregion.style.display = "none";
        }, 2000);
        closeModal();
      }
    }, 1000);
  }

  function checkCloseDialog(e) {
    if (e.key === KEYS.ESC) {
      closeModal();
    }
  }

  // CAROUSEL
  const carousel = document.querySelector('#carousel');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prevButton = document.querySelector('#carouselPrevBtn');
  const nextButton = document.querySelector('#carouselNextBtn');
  const carouselItems = document.querySelector('#carouselItems');
  const carouselNav = document.querySelector('#carouselNav');
  const carouselNavControlItems = carouselNav.querySelectorAll('.carousel__nav-controls-item');
  const carouselNavStartBtn = carouselNav.querySelector('[data-action="start"]');
  const carouselNavStopBtn = carouselNav.querySelector('[data-action="stop"]');
  class MyCarousel {
    constructor() {
      this.DURATION = 5000;
    }
    
    init(settings) {
      this.current = 0;
      this.settings = settings;
      prevButton.addEventListener('click', () => {
        this.stopAnimation();
        this.prevSlide(true);
      });
      nextButton.addEventListener('click', () => {
        this.stopAnimation();
        this.nextSlide(true);
      });
      carouselNav.addEventListener('click', ({ target }) => {
        let navButton;
        if (target.nodeName.toLowerCase() === 'button') {
          navButton = target;
        } else if (target.nodeName.toLowerCase() === 'span' && target.getAttribute('aria-hidden') === 'true') {
          navButton = target.parentNode;
        }
        if (!navButton) return;

        if (navButton.getAttribute('data-slide')) {
          this.stopAnimation();
          this.setSlides({
            newCurrent: parseInt(navButton.getAttribute('data-slide'), 10),
            setFocus: true,
          });
        } else if (navButton === carouselNavStopBtn) {
          this.stopAnimation();
        } else if (navButton === carouselNavStartBtn) {
          this.startAnimation();
        }
      }, true);
      carousel.addEventListener('transitionend', ({ target }) => {
        target.classList.remove('in-transition');
      });

      carousel.addEventListener('focusin', ({ target }) => {
        this.stopAnimation();
      });

      slides[0].classList.add('carousel__slide--active');
      slides[1].classList.add('carousel__slide--next');
      slides[slides.length - 1].classList.add('carousel__slide--prev');
      this.toggleNavigationControl(settings.startAnimated);
      if (settings.startAnimated) {
        this.timer = setTimeout(() => this.nextSlide(), this.DURATION);
      }
    }

    startAnimation() {
      this.settings.animate = true;
      this.toggleNavigationControl(true);
      this.timer = setTimeout(() => this.nextSlide(), this.DURATION);
    }
    
    stopAnimation() {
      this.settings.animate = false;
      this.toggleNavigationControl(false);
      clearTimeout(this.timer);
    }

    setSlides({
      newCurrent,
      setFocus = false,
      transition = 'none',
      announceItem = false,
    }) {
      const length = slides.length;
      let newNext = newCurrent + 1;
      let newPrev = newCurrent - 1;
      if (newNext === length) {
        newNext = 0;
      } else if(newPrev < 0) {
        newPrev = length - 1;
      }

      Array.from(slides).forEach(slide => {
        slide.className = 'carousel__slide';
      });

      slides[newNext].className = `carousel__slide carousel__slide--next ${transition === 'next' ? 'in-transition' : ''}`.trim();
      slides[newPrev].className = `carousel__slide carousel__slide--prev ${transition === 'prev' ? 'in-transition' : ''}`.trim();
      slides[newCurrent].className = 'carousel__slide carousel__slide--active';

      slides[newNext].setAttribute('aria-hidden', 'true');
      slides[newPrev].setAttribute('aria-hidden', 'true');
      slides[newCurrent].removeAttribute('aria-hidden');

      Array.from(carouselNavControlItems).forEach((navButton, idx) => {
        navButton.className = 'carousel__nav-controls-item';
        navButton.innerHTML = '<span class="visually-hidden">Афиша </span> ' + (idx + 1);
      });

      carouselNavControlItems[newCurrent].className = "carousel__nav-controls-item carousel__nav-controls-item--active";
      carouselNavControlItems[newCurrent].innerHTML = '<span class="visually-hidden">Афиша </span> ' + (newCurrent + 1) + ' <span class="visually-hidden">(Текущий слайд)</span>';

      this.current = newCurrent;
    }

    nextSlide(announceItem = false) {
      let newCurrent = this.current + 1;
      if (newCurrent === slides.length) {
        newCurrent = 0;
      }

      this.setSlides({
        newCurrent,
        setFocus: false,
        transition: 'prev',
        announceItem
      });

      if (this.settings.animate) {
        this.timer = setTimeout(() => this.nextSlide(), this.DURATION);
      }
    }

    prevSlide(announceItem = false) {
      let newCurrent = this.current - 1;
      if (newCurrent < 0) {
        newCurrent = slides.length - 1;
      }

      this.setSlides({
        newCurrent,
        setFocus: false,
        transition: 'next',
        announceItem
      });
    }

    toggleNavigationControl(isRunning = false) {
      if (isRunning) {
        carouselItems.setAttribute('aria-live', 'off');
        carouselNavStartBtn.style.display = 'none';
        carouselNavStopBtn.style.display = '';
      } else {
        carouselItems.setAttribute('aria-live', 'polite');
        carouselNavStopBtn.style.display = 'none';
        carouselNavStartBtn.style.display = '';
      }
    }
  }

  const myCarousel = new MyCarousel();
  myCarousel.init({
    startAnimated: true,
    animate: true
  });

  // EVENTS SECTION
  const EVENT_FILTERS = {
    ALL: 'ALL',
    TODAY: 'TODAY',
    TOMORROW: 'TOMORROW'
  };
  const EVENTS_STATE = {
    _events: [
      {
        id: '001',
        title: 'Святослав Рихтер в кругу друзей. Москва - Коктебель',
        dateNote: 'Выставка до 20 ноября',
        description: 'Текст о музее',
        img: 'event-1.png',
        imgAlt: '',
        url: '/buy',
        date: EVENT_FILTERS.TODAY
      },
      {
        id: '002',
        title: 'Тату',
        dateNote: 'Выставка до 27 сентября',
        description: 'Текст о музее',
        img: 'event-2.png',
        imgAlt: '',
        url: '/buy',
        date: EVENT_FILTERS.TODAY
      },
      {
        id: '003',
        title: 'От Дюрера до Матисса. Избранные рисунки из собрания ГМИИ им. А.С. Пушкина',
        dateNote: 'Выставка до 1 ноября',
        description: 'Текст о музее',
        img: 'event-3.png',
        imgAlt: '',
        url: '/buy',
        date: EVENT_FILTERS.TOMORROW
      },
    ],
    filter: EVENT_FILTERS.ALL,
    get events() {
      if (this.filter === EVENT_FILTERS.ALL) {
        return this._events;
      } else {
        return this._events.filter(e => e.date === this.filter);
      }
    },
  };

  eventsFilterForm.addEventListener('change', ({ target }) => {
    const { value } = target;
    EVENTS_STATE.filter = value;
    createEventCardList();
  })

  let timeout;
  function createEventCardList() {
    if (timeout) clearTimeout(timeout);

    eventsContainer.innerHTML = '';
    eventsLiveregion.classList.add('events__loader--pending');
    eventsLiveregion.classList.remove('events__loader--done');
    eventsLiveregion.innerHTML = 'Загрузка событий...';
    
    timeout = setTimeout(() => {
      const eventCardElements = EVENTS_STATE.events.map(event => createEventCard(event));
      eventsLiveregion.classList.remove('events__loader--pending');
      eventsLiveregion.classList.add('events__loader--done');
      eventsLiveregion.innerHTML = `Показано событий: ${eventCardElements.length} из ${EVENTS_STATE.events.length}`;

      eventCardElements.forEach(el => eventsContainer.appendChild(el));
    }, 3000);
  }

  function createEventCard({
    id,
    title,
    dateNote,
    description,
    img,
    imgAlt,
    url
  }) {
    const cardEl = document.createElement('li');
    cardEl.classList.add('card');

    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', `./assets/images/${img}`);
    imgEl.setAttribute('alt', `./assets/images/${imgAlt}`);
    cardEl.appendChild(imgEl);

    const titleEl = document.createElement('h3');
    const titleId = `event--${id}`;
    titleEl.id = titleId;
    titleEl.textContent = title;
    cardEl.appendChild(titleEl);

    const descriptionEl = document.createElement('span');
    descriptionEl.textContent = description;
    cardEl.appendChild(descriptionEl);

    const dateNoteEl = document.createElement('h4');
    dateNoteEl.textContent = dateNote;
    cardEl.appendChild(dateNoteEl);

    const eventUrlLink = document.createElement('a');
    eventUrlLink.classList.add('card__link');
    eventUrlLink.setAttribute('href', url);
    const eventUrlLinkText = document.createElement('span');
    eventUrlLinkText.textContent = 'Купить билет';
    const linkId = `eventLink--${id}`;
    eventUrlLinkText.id = linkId;
    eventUrlLink.appendChild(eventUrlLinkText);
    eventUrlLink.setAttribute('aria-labelledby', `${titleId} ${linkId}`);
    cardEl.appendChild(eventUrlLink);

    return cardEl;
  }

  createEventCardList();

  // MUSEUM SECTION
  const MUSEUM_SECTION_TABS = Array.from(museumSectionTabList.children)
    .reduce((acc, child) => {
      if (child.getAttribute('role') !== 'tab') return acc;
      const { value } = child.dataset;
      return { ...acc, [value]: value };
    }, {});
  const MUSEUM_SECTION_STATE = {
    selected: Object.values(MUSEUM_SECTION_TABS)[0]
  };

  museumSectionTabList.addEventListener('click', ({ target }) => {
    if (target.getAttribute('role') !== 'tab') return;
    const { dataset } = target;
    MUSEUM_SECTION_STATE.selected = dataset.value;
    updateMuseumSection()
  });

  function updateMuseumSection() {
    Array.from(museumSectionTabList.querySelectorAll('[role="tab"]')).forEach(tab => tab.classList.remove('tab--active'));
    const activeTabNode = museumSectionTabList.querySelector(`[data-value="${MUSEUM_SECTION_STATE.selected}"]`);
    activeTabNode.classList.add('tab--active');

    const contentSections =  Array.from(museumSectionContent.querySelectorAll('[id^="tabSection"]'));
    contentSections.forEach(section => {
      if (section.id === `tabSection--${MUSEUM_SECTION_STATE.selected}`) {
        section.style.display = "";
      } else {
        section.style.display = "none";
      }
   })
  }

  updateMuseumSection();

  // SUBSCRIPTION FORM
  const SUBSCRIPTION_FORM_STATE = {
    checked: false
  };

  subscriptionForm.addEventListener('change', ({ target }) => {
    if (target.type === 'checkbox') {
      SUBSCRIPTION_FORM_STATE.checked = target.checked;
    }
    updateSubscribsionForm();
  });

  subscriptionForm.addEventListener('submit', event => {
    event.preventDefault();
    alertLiveregion.textContent = 'Вы успешно подписались на обновления!';
    alertLiveregion.style.display = "block";
    setTimeout(() => {
      alertLiveregion.style.display = "none";
    }, 2000);
  });

  function updateSubscribsionForm() {
    subscriptionBtn.disabled = !SUBSCRIPTION_FORM_STATE.checked;
  }

  updateSubscribsionForm();

  // HELPERS
  function parseFormData(target) {
    return Array.from(new FormData(target)).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }
});
