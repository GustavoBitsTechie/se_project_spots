import { enableValidation, settings, showInputError } from "../scripts/validation.js"; 
import "./index.css";
import logo from '../images/spots-images/logo.svg';
import { resetValidation, hideInputError } from "../scripts/validation.js";
import Api from '../utils/Api.js'
import { setButtonText } from '../utils/helpers.js';

const headerLogoEl = document.querySelector('.header__logo');
if (headerLogoEl) headerLogoEl.src = logo;
  

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c2c8ab7d-84d0-4716-9ca2-904e33f47627",
    "Content-Type": "application/json"
  }
});

let serverCardIds = new Set();

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    api.userId = user._id;
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarEl.src = user.avatar || '';

    // Update serverCardIds set here
    serverCardIds = new Set(cards.map(c => c._id));

    cards.forEach(cardData => {
      const cardElement = createCard(cardData);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const cardsList = document.querySelector('.cards__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
const deleteModal = document.getElementById('delete-modal');

function createCard(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // assign server id (or empty string for local-only)
  cardElement.dataset.id = cardData._id || '';
  const likeBtn = cardElement.querySelector('.card__like-btn');
  if (likeBtn) {
    // Use isLiked if available, otherwise fallback to likes array
    if (typeof cardData.isLiked === 'boolean') {
      likeBtn.classList.toggle('card__like-btn_active', cardData.isLiked);
    } else if (Array.isArray(cardData.likes) && api.userId) {
      const liked = cardData.likes.some(like => like._id === api.userId);
      likeBtn.classList.toggle('card__like-btn_active', liked);
    }
  }
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

const avatarModalBtn = document.querySelector(".profile__avatar-edit-btn");
const avatarEditModal = document.querySelector("#avatar-modal");
const avatarImageInput = document.querySelector("#avatar-image-input");
const avatarEditForm = avatarEditModal ? avatarEditModal.querySelector('.modal__form') : null;
const profileAvatarEl = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");


function findSaveButton(container) {
  if (!container) return null;
  return container.querySelector('.modal__confirm-btn')
    || container.querySelector('button[type="submit"]')
    || container.querySelector('input[type="submit"]')
    || container.querySelector('button');
}

let selectedCard, selectedCardId;

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

function handleLike(event) {
  const likeBtn = event.target;
  const cardEl = likeBtn.closest('.card');
  if (!cardEl) return;
  const cardId = cardEl.dataset.id;
  if (!cardId) {
    console.warn('Like aborted (no server id) — local-only card');
    likeBtn.classList.toggle('card__like-btn_liked'); // optional local toggle
    return;
  }
  const willLike = !likeBtn.classList.contains('card__like-btn_active');
  api.changeLikeCardStatus(cardId, willLike)
    .then(data => {
      console.log('Like status changed successfully:', data);
      likeBtn.classList.toggle('card__like-btn_liked', willLike);
    })
    .catch(err => {
      console.error('Error changing like status:', err);
    });
}

function openModal(modal) {
  if (!modal) {
    console.error('openModal called with null modal');
    return;
  }
  
  modal.classList.remove('modal__is-closed');
  modal.classList.add('modal__is-opened');

  
  if (!modal.__listenersAttached) {
    modal.addEventListener('mousedown', handleOverlayClick);
    document.addEventListener('keydown', handleEscape);
    modal.__listenersAttached = true;
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('modal__is-opened');
  modal.classList.add('modal__is-closed');

  
  if (modal.__listenersAttached) {
    modal.removeEventListener('mousedown', handleOverlayClick);
    document.removeEventListener('keydown', handleEscape);
    modal.__listenersAttached = false;
  }
}


if (deleteModal) {
  const closeBtn = deleteModal.querySelector('.modal__close-btn');
  if (closeBtn && !closeBtn.__listenerAdded) {
    closeBtn.setAttribute('type', 'button');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(deleteModal);
    });
    closeBtn.__listenerAdded = true;
  }

 
  if (!deleteModal.__overlayClickAdded) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeModal(deleteModal);
    });
    deleteModal.__overlayClickAdded = true;
  }
}


if (avatarEditModal) {
  const avatarCloseBtn = avatarEditModal.querySelector('.modal__close-btn');
  if (avatarCloseBtn) {
    avatarCloseBtn.setAttribute('type', 'button'); // prevent form submit
    if (!avatarCloseBtn.__listenerAdded) {
      avatarCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(avatarEditModal);
      });
      avatarCloseBtn.__listenerAdded = true;
    }
  }

  
  if (!avatarEditModal.__overlayClickAdded) {
    avatarEditModal.addEventListener('click', (e) => {
      if (e.target === avatarEditModal) closeModal(avatarEditModal);
    });
    avatarEditModal.__overlayClickAdded = true;
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const saveBtn = findSaveButton(editProfileFormEl);
  console.log('Edit profile saveBtn:', saveBtn); // debug: confirm element found
  if (saveBtn) setButtonText(saveBtn, true, 'Saving...', 'Save');

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  api.setUserInfo({ name, about })
    .then(data => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      if (saveBtn) setButtonText(saveBtn, false, 'Saving...', 'Save');
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const saveBtn = avatarEditForm.querySelector('.modal__confirm-btn') ||
                  avatarEditForm.querySelector('button[type="submit"]') ||
                  avatarEditForm.querySelector('input[type="submit"]');
  if (saveBtn) setButtonText(saveBtn, true, 'Saving...', 'Save');

  const avatarUrl = avatarImageInput.value.trim();
  if (!avatarUrl) {
    if (saveBtn) setButtonText(saveBtn, false, 'Saving...', 'Save');
    return;
  }

  api.setUserAvatar({ avatar: avatarUrl })
    .then(data => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarEditModal);
      avatarEditForm.reset();
    })
    .catch(err => {
      console.error('Error updating avatar:', err);
    })
    .finally(() => {
      if (saveBtn) setButtonText(saveBtn, false, 'Saving...', 'Save');
    });
}


if (avatarEditForm && !avatarEditForm.__avatarHandlerAttached) {
  avatarEditForm.addEventListener('submit', handleAvatarSubmit);
  avatarEditForm.__avatarHandlerAttached = true;
}

function handleDeleteCard(evt) {
    evt.preventDefault();
    const selectedCard = deleteModal.dataset.cardElement;
    if (selectedCard && selectedCard.remove) {
      selectedCard.remove();
    }
    const selectedCardId = deleteModal.dataset.cardId;
    if (selectedCardId && typeof api !== 'undefined' && typeof api.deleteCard === 'function') {
      api.deleteCard(selectedCardId)
        .then(() => {
          console.log('Card deleted successfully:', selectedCardId);
        })
        .catch(err => {
          console.error('Error deleting card:', err);
        });
    } openModal(deleteModal);  
}

if (avatarEditForm) {
  avatarEditForm.addEventListener("submit", handleAvatarSubmit);
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

editProfileFormEl.addEventListener("submit", handleEditProfileSubmit);

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarEditModal);

  if (avatarImageInput) avatarImageInput.value = '';

  const modalPreview = avatarEditModal ? avatarEditModal.querySelector('.modal__avatar-preview') : null;
  if (modalPreview) {
    
    modalPreview.src = profileAvatarEl && profileAvatarEl.src ? profileAvatarEl.src : 'https://images.unsplash.com/photo-1680355466468-bd0a68b11fa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHByb2ZpbGUlMjBhdmF0YXIlMjBpbWFnZSUyMGljb258ZW58MHx8MHx8fDI%3D';
    modalPreview.alt = profileAvatarEl && profileAvatarEl.alt ? profileAvatarEl.alt : 'Avatar preview';

   
  }

  if (avatarEditForm && avatarImageInput) {
    hideInputError(avatarEditForm, avatarImageInput, settings);
  }
});




newPostFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const saveBtn = findSaveButton(newPostFormEl);
  if (saveBtn) setButtonText(saveBtn, true, 'Saving...', 'Save');

  const inputValues = {
    name: newPostDescriptionInput.value,
    link: newPostImageInput.value
  };

  api.addCard(inputValues)
    .then(cardData => {
      // add server id to set
      if (cardData && cardData._id) serverCardIds.add(cardData._id);
      const cardElement = createCard(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      newPostFormEl.reset();
    })
    .catch(err => {
      console.error('Error adding card:', err);
    })
    .finally(() => {
      if (saveBtn) setButtonText(saveBtn, false, 'Saving...', 'Save');
    });
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

  openModal(deleteModal);

 
  deleteModal.dataset.cardId = card.dataset.id;
});

const deleteConfirmBtn = deleteModal ? deleteModal.querySelector('.modal__confirm-btn') : null;
const deleteCancelBtn = deleteModal ? deleteModal.querySelector('.modal__cancel-btn') : null;


function performDelete(evt) {
  if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();

  
  const actionBtn = (evt && (evt.currentTarget || evt.target.closest && evt.target.closest('button'))) || deleteCancelBtn || deleteConfirmBtn;

  
  if (actionBtn) setButtonText(actionBtn, true, 'Deleting...', 'Delete');

  
  if (!selectedCard && deleteModal && deleteModal.dataset.cardId) {
    const id = deleteModal.dataset.cardId;
    selectedCard = document.querySelector(`[data-id="${id}"]`);
  }
  const cardId = (selectedCard && (selectedCard.dataset.id || selectedCard.dataset._id)) || deleteModal.dataset.cardId;
  const cardEl = selectedCard || (cardId ? document.querySelector(`[data-id="${cardId}"]`) : null);

  
  let promise;
  if (cardId && api && typeof api.deleteCard === 'function') {
    promise = api.deleteCard(cardId).then(() => {
      if (cardEl && typeof cardEl.remove === 'function') cardEl.remove();
    });
  } else {
    
    if (cardEl && typeof cardEl.remove === 'function') cardEl.remove();
    promise = Promise.resolve();
  }

  promise
    .catch(err => console.error('deleteCard failed:', err))
    .finally(() => {
      
      if (actionBtn) setButtonText(actionBtn, false, 'Deleting...', 'Delete');
      selectedCard = null;
      selectedCardId = null;
      if (deleteModal) closeModal(deleteModal);
    });
}


if (deleteConfirmBtn) {
  deleteConfirmBtn.removeEventListener('click', performDelete); 
  deleteConfirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (deleteModal) closeModal(deleteModal);
  });
}


if (deleteCancelBtn) {
  deleteCancelBtn.removeEventListener('click', performDelete); 
  deleteCancelBtn.addEventListener('click', performDelete);
}

const avatarRemoveBtn = document.querySelector('.profile__avatar-remove-btn');
if (avatarRemoveBtn) {
  avatarRemoveBtn.addEventListener('click', (e) => {
    e.preventDefault();
   
    setButtonText(avatarRemoveBtn, true, 'Removing...', 'Remove');

  
    const newAvatarValue = 'https://images.unsplash.com/photo-1680355466468-bd0a68b11fa0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHByb2ZpbGUlMjBhdmF0YXIlMjBpbWFnZSUyMGljb258ZW58MHx8MHx8fDI%3D'; // or '/path/to/placeholder.png'
    if (typeof api.setUserAvatar === 'function') {
      api.setUserAvatar({ avatar: newAvatarValue })
        .then(data => {
         
          profileAvatarEl.src = data && data.avatar ? data.avatar : '';
          profileAvatarEl.alt = 'No avatar';
        })
        .catch(err => {
          console.error('Failed to remove avatar on server:', err);
          
          profileAvatarEl.removeAttribute('src');
        })
        .finally(() => {
          setButtonText(avatarRemoveBtn, false, 'Removing...', 'Remove');
        });
    } else {
      
      profileAvatarEl.removeAttribute('src');
      setButtonText(avatarRemoveBtn, false, 'Removing...', 'Remove');
    }
  });
}


if (cardsList) {
  cardsList.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.card__like-btn');
    if (!likeBtn) return;
    e.preventDefault();

    const cardEl = likeBtn.closest('.card');
    if (!cardEl) return;

    const cardId = (cardEl.dataset.id || '').trim();
    if (!cardId) {
      console.warn('[LIKE] local-only card (no server id)');
      return;
    }

    const willLike = !likeBtn.classList.contains('card__like-btn_active');

    api.changeLikeCardStatus(cardId, willLike)
      .then(updatedCard => {
        console.log('[LIKE] updatedCard:', updatedCard);

        // Use isLiked from the server response
        if (typeof updatedCard.isLiked === 'boolean') {
          likeBtn.classList.toggle('card__like-btn_active', updatedCard.isLiked);
        } else {
          // fallback: toggle based on intent
          likeBtn.classList.toggle('card__like-btn_active', willLike);
          console.warn('[LIKE] Server response missing isLiked property.');
        }
      })
      .catch(err => {
        console.error('[LIKE] API error for', cardId, err);
      });
  });
}






