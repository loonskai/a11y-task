document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#modal');
  const modalMask = document.querySelector('#modal-mask');
  const loginBtn = document.querySelector('#login-btn');
  const eventsContainerEl = document.querySelector('#events-container');
  const eventsFilterForm = document.querySelector('#events-filter-form');
  const museumSectionTabList = document.querySelector('#museum-section__tablist');
  const museumSectionContent = document.querySelector('#museum-section__content');

  const KEYS = {
    ESC: 'Escape',
    TAB: 'Tab',
  };

  // MODAL
  loginBtn.addEventListener('click', openModal);
  let previousActiveElement;

  function openModal() {
    previousActiveElement = document.activeElement;
    Array.from(document.body.children).forEach(child => {
      if (child !== modal) child.inert = true;
    });

    modal.classList.remove('non-visible');
    modal.classList.add('visible');
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

    modal.classList.add('non-visible');
    modal.classList.remove('visible');

    previousActiveElement.focus();
  }

  function checkCloseDialog(e) {
    if (e.key === KEYS.ESC) {
      closeModal();
    }
  }

  // EVENTS
  const EVENT_FILTERS = {
    ALL: 'ALL',
    TODAY: 'TODAY',
    TOMORROW: 'TOMORROW'
  };
  const EVENTS_STATE = {
    _events: [
      {
        title: 'Святослав Рихтер в кругу друзей. Москва - Коктебель',
        dateNote: 'Выставка до 20 ноября',
        description: 'Текст о музее',
        img: 'event-1.png',
        imgAlt: '',
        url: '/buy',
        date: EVENT_FILTERS.TODAY
      },
      {
        title: 'Тату',
        dateNote: 'Выставка до 27 сентября',
        description: 'Текст о музее',
        img: 'event-2.png',
        imgAlt: '',
        url: '/buy',
        date: EVENT_FILTERS.TODAY
      },
      {
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

  const eventUrlLinkEl = document.createElement('a');
  eventUrlLinkEl.classList.add('card__link');
  eventUrlLinkEl.appendChild(document.createTextNode('Купить билет'));

  eventsFilterForm.addEventListener('change', ({ target }) => {
    const { value } = target;
    EVENTS_STATE.filter = value;
    createEventCardList();
  })

  let timeout;
  function createEventCardList() {
    setLoader();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      const eventCardElements = EVENTS_STATE.events.map(event => createEventCardEl(event));
      eventsContainerEl.innerHTML = '';
      eventCardElements.forEach(el => eventsContainerEl.appendChild(el));
    }, 1000);
  }

  function createEventCardEl({
    title,
    dateNote,
    description,
    img,
    imgAlt,
    url
  }) {
    const cardEl = document.createElement('div');
    const titleEl = document.createElement('h3');
    const imgEl = document.createElement('img');
    const dateNoteEl = document.createElement('h4');
    const descriptionEl = document.createElement('span');
    const linkEl = eventUrlLinkEl.cloneNode(true);
    
    cardEl.classList.add('card');
    imgEl.setAttribute('src', `./assets/images/${img}`);
    imgEl.setAttribute('alt', `./assets/images/${imgAlt}`);
    titleEl.appendChild(document.createTextNode(title));
    dateNoteEl.appendChild(document.createTextNode(dateNote));
    descriptionEl.appendChild(document.createTextNode(description));
    linkEl.setAttribute('href', url);

    cardEl.appendChild(imgEl);
    cardEl.appendChild(titleEl);
    cardEl.appendChild(dateNoteEl);
    cardEl.appendChild(descriptionEl);
    cardEl.appendChild(linkEl);
    return cardEl;
  }

  function setLoader() {
    const loader = document.createElement('div');
    loader.classList.add('events__loader');
    loader.appendChild(document.createTextNode('Загрузка...'))
    eventsContainerEl.appendChild(loader);
  }

  createEventCardList();

  // MUSEUM
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

    const contentSections =  Array.from(museumSectionContent.querySelectorAll('[id^="tab-section"]'));
   contentSections.forEach(section => {
    if (section.id === `tab-section--${MUSEUM_SECTION_STATE.selected}`) {
      section.style.display = "";
    } else {
      section.style.display = "none";
    }
   })
  }

  updateMuseumSection();
});
