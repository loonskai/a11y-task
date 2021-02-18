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

