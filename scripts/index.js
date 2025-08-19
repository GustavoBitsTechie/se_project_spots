const initialCards = [
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

  {  name: "Tunned with morning light",
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

  function openModal(modal) {
    modal.classList.add("modal__is-opened");
  }
  function closeModal(modal) {
    modal.classList.remove("modal__is-opened");
  }

  editProfileBtn.addEventListener("click", function () {
    openModal(editProfileModal);
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  });

  editProfileCloseBtn.addEventListener("click", function () {
    closeModal(editProfileModal);
  });

  newPostBtn.addEventListener("click", function () {
    openModal(newPostModal);
  });

  newPostCloseBtn.addEventListener("click", function () {
    closeModal(newPostModal);
  });

  function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;

    editProfileModal.classList.remove("modal__is-opened");
  }

  function handleAddCardSubmit(evt) {
    evt.preventDefault();

     newPostImageInput.textContent = newPostImageEl.value;
     newPostDescriptionInput.textContent = newPostDescriptionInput.value;

    newPostModal.classList.remove("modal__is-opened");
  }

  editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);
  newPostFormEl.addEventListener("submit", handleAddCardSubmit);

  initialCards.forEach(function (card) {
    console.log(card.name);
    console.log(card.link);
  });