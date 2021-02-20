document.addEventListener('DOMContentLoaded', () => {

  const modal = document.querySelector('#modal');
  const modalMask = document.querySelector('.modal-mask');
  const loginBtn = document.querySelector('#login-btn');

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
  let EVENTS = [];
  const EVENT_FILTERS = {
    ALL: 'ALL',
    TODAY: 'TODAY',
    TOMORROW: 'TOMORROW'
  };

  let dateFilter = EVENT_FILTERS.ALL;

  const eventsContainerEl = document.getElementById('events-container');
  const loader = document.getElementById('events-loader');
  const eventUrlLinkEl = document.createElement('a');
  eventUrlLinkEl.appendChild(document.createTextNode('Купить билет'));

  function createEventCardList(cb) {
    const filteredEvents = filterEventsByDate(EVENTS);
    const eventCardElements = filteredEvents.map(event => createEventCardEl(event));
    cb();
    eventCardElements.forEach(el => eventsContainerEl.appendChild(el));
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
    const dateNoteEl = document.createElement('span');
    const descriptionEl = document.createElement('span');
    const linkEl = eventUrlLinkEl.cloneNode(true);
    
    titleEl.appendChild(document.createTextNode(title));
    imgEl.setAttribute('src', `./assets/images/${img}`);
    imgEl.setAttribute('alt', `./assets/images/${imgAlt}`);
    dateNoteEl.appendChild(document.createTextNode(dateNote));
    descriptionEl.appendChild(document.createTextNode(description));
    linkEl.setAttribute('href', url);

    cardEl.classList.add('event-card');
    cardEl.appendChild(titleEl);
    cardEl.appendChild(imgEl);
    cardEl.appendChild(dateNoteEl);
    cardEl.appendChild(descriptionEl);
    cardEl.appendChild(linkEl);
    return cardEl;
  }

  function filterEventsByDate(events) {
    if (dateFilter === EVENT_FILTERS.ALL) return events;
    return EVENTS.filter(e => e.date === dateFilter);
  }

  function updateEventsFilter(value) {
    dateFilter = value;
  }

  function setLoader(value) {
    if (value) {
      loader.style.display = "";
    } else {
      loader.style.display = "none";
    }
  }

  setTimeout(() => {
    setLoader();
    EVENTS = [
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
    ];
    createEventCardList(() => setLoader(false));
  }, 1000);
});
