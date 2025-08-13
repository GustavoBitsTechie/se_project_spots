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
  const editProfileCloseBtn = document.querySelector(".modal__close-btn");

  const newPostBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

  editProfileBtn.addEventListener("click", function () {
    editProfileModal.classList.add("modal__is-opened");
  });

  editProfileCloseBtn.addEventListener("click", function () {
    editProfileModal.classList.remove("modal__is-opened");
  });

  newPostBtn.addEventListener("click", function () {
    newPostModal.classList.add("modal__is-opened");
  });

  newPostCloseBtn.addEventListener("click", function () {
    newPostModal.classList.remove("modal__is-opened");
  });

  initialCards.forEach(function (card) {
    console.log(card.name);
    console.log(card.link);
  })