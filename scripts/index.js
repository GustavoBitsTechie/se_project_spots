const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  { name: "Restraurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},

  { name:"An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},

  {  name: "A very long bridge, over the forest and through the trees",
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},

  {  name: "Tunnel with morning light",
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},

  {  name: "Mountain house",
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
];



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
  const newPostImageEl = document.querySelector(".modal__input");

  const previewModal = document.querySelector("#preview-modal");
  const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
  const previewImageEl = previewModal.querySelector(".modal__image");
  const previewCaptionEl = previewModal.querySelector(".modal__caption");


  const cardTemplate = document
  .querySelector("#card-template")
    .content.querySelector(".card");
    const cardsList = document.querySelector(".cards__list");

  function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", function ()  {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  previewCloseBtn.addEventListener("click", function () {
  previewModal.classList.remove("modal__is-opened");
});

  return cardElement;
}

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

  function openModal(modal) {
    modal.classList.add("modal__is-opened");
    modal.addEventListener('mousedown', handleOverlayClick);
    document.addEventListener('keydown', handleEscape);
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

editProfileFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;

  closeModal(editProfileModal);
  editProfileFormEl.reset();
  resetValidation(editProfileFormEl, settings)
});

newPostFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostDescriptionInput.value,
    link: newPostImageInput.value
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  closeModal(newPostModal);
  newPostFormEl.reset();
  resetValidation(newPostFormEl, settings);
});


  initialCards.forEach(function (item) {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement);
  });