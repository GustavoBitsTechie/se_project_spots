import { enableValidation, settings, showInputError, resetValidation, hideInputError } from "../scripts/validation.js";
import "./index.css";
import logo from '../images/spots-images/logo.svg';
import Api from "../utils/Api.js";
import "../blocks/page.css";
import "../blocks/profile.css";
import "../blocks/cards.css";
import "../blocks/modal.css";
import "../blocks/content.css";
import "../blocks/card.css";
import "../blocks/footer.css";
import "../blocks/header.css";

const headerLogoEl = document.querySelector('.header__logo');
if (headerLogoEl) headerLogoEl.src = logo;
  
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {
    name: "Peace and tranquility on the ocean",
    link: "https://images.unsplash.com/photo-1708893634094-f6604d94e43f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    name: "Above the clouds",
    link: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Lights in the sky",
    link: "https://images.unsplash.com/photo-1578086515327-55117bdd0cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGZyZWUlMjBpbWFnZXN8ZW58MHwxfDB8fHwy"
  },
  {
    name: "Peppers",
    link: "https://images.unsplash.com/photo-1632446087110-b63b69a18957?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGZyZWUlMjBpbWFnZXN8ZW58MHwxfDB8fHwy"
  },
  {
    name: "Squirrel!",
    link: "https://images.unsplash.com/photo-1729991163083-bb78a3fefd8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM0fHxmcmVlJTIwaW1hZ2VzfGVufDB8MXwwfHx8Mg%3D%3D"
  },
  {
    name: "Fog of the night",
    link: "https://images.unsplash.com/photo-1675767304968-2e8617b00d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk0fHxmcmVlJTIwaW1hZ2VzfGVufDB8MXwwfHx8Mg%3D%3D"
  },

];

const cardsList = document.querySelector('.cards__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "e53975c1-e30c-4bde-9f80-52b9fa34cc90",
    "Content-Type": "application/json"
  }
});

api.getAppInfo().then(([userData, cards]) => {
  cards.forEach(cardData => {
    const cardEl = createCard(cardData);
    cardsList.append(cardEl); 
  });
  profileNameEl.textContent = userData.name;
  profileDescriptionEl.textContent = userData.about;
});


function createCard(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (cardData.id) cardElement.dataset.id = cardData.id;
  else if (cardData._id) cardElement.dataset.id = cardData._id;


  return cardElement;
}



const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostFormEl = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostDescriptionInput = newPostModal.querySelector("#caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editAvatarBtn = document.querySelector(".profile__avatar-edit-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");

function openModal(modal) {
  modal.classList.add("modal__is-opened");
}

editAvatarBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

function handleOverlayClick(event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target);
  }
}

function handleEscape(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal__is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}


function closeModal(modal) {
  modal.classList.remove("modal__is-opened");
  modal.removeEventListener('mousedown', handleOverlayClick);
  document.removeEventListener('keydown', handleEscape);
}


editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});
newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
});


newPostFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostDescriptionInput.value,
    link: newPostImageInput.value
  };

  const cardElement = createCard(inputValues);
  cardsList.prepend(cardElement);

  closeModal(newPostModal);
  newPostFormEl.reset();
});


enableValidation(settings);


window.resetValidation = (formElement, settingsArg) => resetValidation(formElement, settingsArg);
window.hideInputError = hideInputError;
window.showInputError = showInputError;

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".card__delete-btn");
  if (!btn) return;
  const card = btn.closest(".card");
  if (!card) return;
 
  const cardId = card.dataset.id;
  card.remove();

  if (typeof api !== "undefined" && typeof api.deleteCard === "function" && cardId) {
    api.deleteCard(cardId).catch((err) => console.error("deleteCard failed:", err));
  }
});


const form = document.querySelector(".my-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resetValidation(form);
  });
}

editProfileFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  api.editUserInfo({ name, about })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
      editProfileFormEl.reset();
    })
    .catch((err) => {
      console.error("editUserInfo failed:", err);
    });
});


function handleAvatarSubmit(event) {
  event.preventDefault();
  const avatarLink = avatarInput.value;
  console.log(avatarInput.value);
  api.editAvatarInfo(avatarLink)
    .then((userData) => {
      console.log(data.avatar);
      profileAvatarEl.src = userData.avatar;
      closeModal(editAvatarModal);
      editAvatarFormEl.reset();
    })
    .catch((err) => {
      console.error("editAvatarInfo failed:", err);
    });
}
editAvatarBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});
editAvatarCloseBtn.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

editAvatarFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const avatarLink = avatarInput.value;

  api.editAvatar(avatarLink)
    .then((userData) => {
      profileAvatarEl.src = userData.avatar;
      closeModal(editAvatarModal);
      editAvatarFormEl.reset();
    })
    .catch((err) => {
      console.error("editAvatar failed:", err);
    });
});

function editAvatarInfo({avatar}) {
  return fetch(`${api._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: api._headers,
    body: JSON.stringify({
     avatar,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);  
  });
}

// Safe, non‑redeclaring handlers to open/close the Edit Avatar modal
document.querySelector(".profile__avatar-edit-btn")?.addEventListener("click", () => {
  document.querySelector("#edit-avatar-modal")?.classList.add("modal__is-opened");
});

document.querySelector("#edit-avatar-modal .modal__close-btn")?.addEventListener("click", () => {
  document.querySelector("#edit-avatar-modal")?.classList.remove("modal__is-opened");
});

// Close when clicking the overlay (modal background)
document.querySelector("#edit-avatar-modal")?.addEventListener("mousedown", (evt) => {
  if (evt.target === evt.currentTarget) evt.currentTarget.classList.remove("modal__is-opened");
});


document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    document.querySelector("#edit-avatar-modal.modal__is-opened")?.classList.remove("modal__is-opened");
  }
});
