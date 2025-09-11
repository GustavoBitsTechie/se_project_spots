import { enableValidation, settings } from "../scripts/validation.js";
// ensure webpack bundles & serves the stylesheet
import './index.css';
import logo from '../images/spots-images/logo.svg';
import Api from "../utils/Api.js";
import "../blocks/page.css";
import "../blocks/cards.css";
import "../blocks/main.css";
import "../blocks/modal.css";
import "../blocks/content.css";
import "../blocks/card.css";
import "../blocks/footer.css";
import "../blocks/header.css";
import defaultAvatar from '../images/spots-images/GusPhoto.jpg';
import closeIcon from '../images/spots-images/xbutton.svg';
// if you prefer .png, add the file at ../images/spots-images/GusPhoto.png instead

const initialCards = [
  { name: "Golden Gate Bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg" },
  { name: "Peace and tranquility on the ocean", link: "https://images.unsplash.com/photo-1708893634094-f6604d94e43f?q=80&w=774&auto=format&fit=crop" },
  { name: "Above the clouds", link: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=2864&auto=format&fit=crop" },
  { name: "Lights in the sky", link: "https://images.unsplash.com/photo-1578086515327-55117bdd0cd2?w=500&auto=format&fit=crop&q=60" },
  { name: "Peppers", link: "https://images.unsplash.com/photo-1632446087110-b63b69a18957?w=500&auto=format&fit=crop&q=60" },
  { name: "Squirrel!", link: "https://images.unsplash.com/photo-1729991163083-bb78a3fefd8f?w=500&auto=format&fit=crop&q=60" },
  { name: "Fog of the night", link: "https://images.unsplash.com/photo-1675767304968-2e8617b00d37?w=500&auto=format&fit=crop&q=60" }
];

console.log('bundle: start');

document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('bundle: DOMContentLoaded');

  // Elements used across the app
  const headerLogoEl = document.querySelector('.header__logo');
  const profileNameEl = document.querySelector('.profile__name');
  const profileDescriptionEl = document.querySelector('.profile__description');
  const profileAvatarEl = document.querySelector('.profile__avatar');
  if (profileAvatarEl && (!profileAvatarEl.getAttribute('src') || profileAvatarEl.getAttribute('src').trim() === '')) {
    profileAvatarEl.src = defaultAvatar;
  }
  const editAvatarBtn = document.querySelector('.profile__avatar-edit-btn');
  const editAvatarModal = document.querySelector('#edit-avatar-modal');
  // editAvatarModal already declared above — just grab its form and input
  const editAvatarFormEl = editAvatarModal?.querySelector('.modal__form');
  const avatarInput = editAvatarModal?.querySelector('#avatar-input');

  // AVATAR MONITOR: logs every src change and stack trace
  (function monitorAvatar(avatar) {
    if (!avatar) return;
    console.log('[AVATAR MONITOR] installed, initial src ->', avatar.src);

    // MutationObserver for attribute changes
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName === 'src') {
          console.warn('[AVATAR MONITOR] mutation setAttribute src ->', avatar.getAttribute('src'));
          console.trace();
        }
      });
    });
    mo.observe(avatar, { attributes: true, attributeFilter: ['src'] });

    // wrap the instance property setter for this element
    const protoDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (protoDesc && protoDesc.set) {
      const origSetter = protoDesc.set;
      try {
        Object.defineProperty(avatar, 'src', {
          configurable: true,
          enumerable: true,
          set(value) {
            console.warn('[AVATAR MONITOR] property write avatar.src =', value);
            console.trace();
            return origSetter.call(this, value);
          },
          get() {
            return protoDesc.get.call(this);
          }
        });
      } catch (e) {
        console.warn('[AVATAR MONITOR] failed to wrap avatar.src property', e);
      }
    }

   
    const origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      if (this === avatar && String(name).toLowerCase() === 'src') {
        console.warn('[AVATAR MONITOR] setAttribute("src") ->', value);
        console.trace();
      }
      return origSetAttr.call(this, name, value);
    };

   
    avatar.__avatarMonitor = { mo, origSetAttr };
  })(profileAvatarEl);


  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error('No URL'));
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('Image load error'));
      img.src = url;
    });
  }


  async function setAvatarSafe(candidateUrl) {
    if (!profileAvatarEl) return;
    const trimmed = (typeof candidateUrl === 'string' && candidateUrl.trim()) ? candidateUrl.trim() : '';

   
    const isPlaceholder = (url) => {
      if (!url) return true;
      return /avatar_placeholder|avatar\.jpg|GusPhoto/i.test(url);
    };
    if (!trimmed || isPlaceholder(trimmed)) {
      
      return;
    }

    const currentSrc = profileAvatarEl.src || '';
    try {
      
      const normalized = new URL(trimmed, location.href).href;
      if (normalized === currentSrc) return;
    } catch (e) {  }

    try {
      await preloadImage(trimmed);
      profileAvatarEl.src = trimmed;
    } catch (e) {
      
      profileAvatarEl.src = defaultAvatar;
    }
  }

  
  if (profileAvatarEl) {
    
    const onAvatarError = () => {
      profileAvatarEl.removeEventListener('error', onAvatarError);
      profileAvatarEl.src = defaultAvatar;
    };
    profileAvatarEl.addEventListener('error', onAvatarError);
  }

  const cardTemplate = document.querySelector('#card-template')?.content?.querySelector('.card');
  const cardsList = document.querySelector('.cards__list');

 
  const editProfileBtn = document.querySelector('.profile__edit-btn');
  const editProfileModal = document.querySelector('#edit-profile-modal');
  const editProfileFormEl = editProfileModal?.querySelector('.modal__form');
  const editProfileNameInput = editProfileModal?.querySelector('#profile-name-input');
  const editProfileDescriptionInput = editProfileModal?.querySelector('#profile-description-input');

  const newPostBtn = document.querySelector('.profile__add-btn');
  const newPostModal = document.querySelector('#new-post-modal');
  const newPostFormEl = newPostModal?.querySelector('.modal__form');
  const newPostImageInput = newPostModal?.querySelector('#card-image-input');
  const newPostDescriptionInput = newPostModal?.querySelector('#caption-input');

  const deleteModal = document.querySelector('#delete-modal');
  const deleteForm = document.querySelector('#delete-form');
  const cancelBtn = deleteForm?.querySelector('.modal__cancel-btn');
  const deleteBtn = deleteForm?.querySelector('.modal__delete-btn, .modal__submit-btn');

  const previewModal = document.querySelector('.modal_type_preview');
  const previewImage = previewModal?.querySelector('.modal__preview-image');
  const previewCaption = previewModal?.querySelector('.modal__caption');

  
  if (headerLogoEl) headerLogoEl.src = logo;
  if (profileAvatarEl) {
    
    const onAvatarError = () => {
      profileAvatarEl.removeEventListener('error', onAvatarError);
      profileAvatarEl.src = defaultAvatar;
    };
    profileAvatarEl.addEventListener('error', onAvatarError);
  }

  
  document.querySelectorAll('.modal__close-btn').forEach(b => {
    b.style.background = `transparent url(${closeIcon}) center/contain no-repeat`;
    b.style.width = '32px';
    b.style.height = '32px';
  });

  
  function createCard(cardData = {}) {
    if (!cardTemplate) {
      const li = document.createElement('li');
      li.className = 'card';
      li.textContent = cardData.name || 'No data';
      return li;
    }
    const cardElement = cardTemplate.cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-btn');
    const deleteButton = cardElement.querySelector('.card__delete-btn');

    cardImage.src = cardData.link || defaultAvatar;
    cardImage.alt = cardData.name || '';
    cardTitle.textContent = cardData.name || '';

    if (cardData._id || cardData.id) cardElement.dataset.id = cardData._id ?? cardData.id;

    likeButton?.addEventListener('click', () => {
      likeButton.classList.toggle('card__like-btn_active');
     
    });

    deleteButton?.addEventListener('click', () => {
      selectedCard = cardElement;
      selectedCardId = cardElement.dataset.id ?? null;
      openModal(deleteModal);
    });

    return cardElement;
  }

  
  if (cardsList && cardTemplate && Array.isArray(initialCards)) {
    cardsList.innerHTML = '';
    initialCards.forEach(c => cardsList.appendChild(createCard(c)));
  }

  
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('modal_opened');
    modal.removeAttribute('aria-hidden');
    document.addEventListener('keydown', handleEscape);
    modal.addEventListener('mousedown', handleOverlayClick);
    
    const focusable = modal.querySelector('button, [tabindex]:not([tabindex="-1"]), input, select, textarea, a[href]');
    if (focusable) focusable.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('modal_opened');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleEscape);
    modal.removeEventListener('mousedown', handleOverlayClick);
  }
  function handleOverlayClick(e) {
    if (e.target.classList.contains('modal')) closeModal(e.target);
  }
  function handleEscape(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.modal_opened').forEach(closeModal);
    }
  }

  
  cardsList?.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.card__like-btn');
    if (likeBtn) {
      likeBtn.classList.toggle('card__like-btn_active');
      return;
    }

    const clickedImage = e.target.closest('.card__image, .card__image *');
    if (!clickedImage) return;

    const card = e.target.closest('.card');
    const caption = card?.querySelector('.card__title')?.textContent || '';
    let url = '';
    const imgEl = clickedImage.tagName === 'IMG' ? clickedImage : clickedImage.querySelector('img');
    if (imgEl && imgEl.src) url = imgEl.src;
    if (url && previewModal && previewImage) {
      previewImage.src = url;
      previewImage.alt = caption;
      if (previewCaption) previewCaption.textContent = caption;
      previewModal.classList.add('modal_opened');
    }
  });

  
  previewModal?.addEventListener('click', (e) => {
    if (e.target === previewModal || e.target.classList.contains('modal__overlay') || e.target.closest('.modal__close-btn')) {
      previewModal.classList.remove('modal_opened');
      if (previewImage) { previewImage.src = ''; previewImage.alt = ''; }
      if (previewCaption) previewCaption.textContent = '';
    }
  });
 

  
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "e53975c1-e30c-4bde-9f80-52b9fa34cc90",
      "Content-Type": "application/json"
    }
  });

 
  let selectedCard = null;
  let selectedCardId = null;

  api.getAppInfo()
    .then(([userData, serverCards]) => {
      console.log('getAppInfo userData.about ->', userData?.about);
      const isPlaceholderText = (s) => {
        if (!s) return true;
        return /placeholder|default|anonymous|avatar_placeholder/i.test(s);
      };

      if (profileNameEl && userData?.name) profileNameEl.textContent = userData.name;

      if (profileDescriptionEl) {
        const about = (userData?.about || '').toString().trim();
        if (about && !isPlaceholderText(about)) {
          profileDescriptionEl.textContent = about;
        } else {
          console.log('Keeping existing profile description (API about was empty/placeholder)');
        }
      }

      
      if (userData?.avatar && !/avatar_placeholder|avatar\.jpg|GusPhoto/i.test(userData.avatar)) {
        setAvatarSafe(userData.avatar);
      }

      if (Array.isArray(serverCards) && serverCards.length && cardsList) {
        cardsList.innerHTML = '';
        serverCards.forEach(cd => cardsList.appendChild(createCard(cd)));
      }
    })
    .catch(err => {
      console.warn('getAppInfo failed, using fallback cards', err);
      
    });

  
  newPostFormEl?.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const imageUrl = newPostImageInput?.value.trim();
    const caption = newPostDescriptionInput?.value.trim();
    if (!imageUrl || !caption) {
      alert('Please provide image URL and caption.');
      return;
    }
    // Show "Saving..." on the submit button
    const saveBtn = newPostFormEl.querySelector('.modal__submit-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }
    try {
      const created = await api.createCard({ name: caption, link: imageUrl });
      cardsList?.prepend(createCard(created));
      newPostFormEl.reset();
      closeModal(newPostModal);
    } catch (e) {
      console.error('createCard failed', e);
      alert('Failed to create post.');
    } finally {
      // Restore button state
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  });

  
  deleteForm?.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (!selectedCard) {
      closeModal(deleteModal);
      return;
    }
    const id = selectedCardId;
    if (!id) {
      selectedCard.remove();
      selectedCard = null;
      closeModal(deleteModal);
      return;
    }
    deleteBtn && (deleteBtn.disabled = true, deleteBtn.textContent = 'Deleting...');
    api.deleteCard(id).then(() => {
      selectedCard?.remove();
      selectedCard = null;
      closeModal(deleteModal);
    }).catch(err => console.error('delete failed', err)).finally(() => {
      if (deleteBtn) { deleteBtn.disabled = false; deleteBtn.textContent = 'Delete'; }
    });
  });

  cancelBtn?.addEventListener('click', () => {
    if (selectedCard) selectedCard.classList.remove('pending-delete');
    selectedCard = null;
    selectedCardId = null;
    closeModal(deleteModal);
  });

  
  editAvatarFormEl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = avatarInput?.value.trim();
    if (!link) return;
    api.editAvatar(link).then(user => {
      setAvatarSafe(user?.avatar);
      closeModal(editAvatarModal);
      editAvatarFormEl.reset();
    }).catch(err => console.error('editAvatar failed', err));
  });
  editAvatarBtn?.addEventListener('click', () => openModal(editAvatarModal));
  editAvatarModal?.querySelector('.modal__close-btn')?.addEventListener('click', () => closeModal(editAvatarModal));

  // wire profile buttons to open modals
  if (editProfileBtn && editProfileModal) {
    editProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(editProfileModal);
      setTimeout(() => editProfileNameInput?.focus(), 0);
    });
  }

  if (newPostBtn && newPostModal) {
    newPostBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(newPostModal);
      setTimeout(() => newPostImageInput?.focus(), 0);
    });
  }

  if (editAvatarBtn && editAvatarModal) {
    editAvatarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(editAvatarModal);
      setTimeout(() => avatarInput?.focus(), 0);
    });
  }

  // clicking avatar image also opens avatar modal (keyboard accessible)
  if (profileAvatarEl && editAvatarModal) {
    profileAvatarEl.tabIndex = profileAvatarEl.tabIndex || 0;
    profileAvatarEl.addEventListener('click', () => openModal(editAvatarModal));
    profileAvatarEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(editAvatarModal); }
    });
  }

  // Profile edit
  editProfileBtn?.addEventListener('click', () => {
    if (profileNameEl) editProfileNameInput.value = profileNameEl.textContent || '';
    if (profileDescriptionEl) editProfileDescriptionInput.value = profileDescriptionEl.textContent || '';
    openModal(editProfileModal);
  });
  editProfileFormEl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = editProfileNameInput?.value.trim() || '';
    const about = editProfileDescriptionInput?.value.trim() || '';

    const saveBtn = editProfileFormEl?.querySelector('.modal__submit-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    api.editUserInfo({ name, about }).then(user => {
      if (profileNameEl) profileNameEl.textContent = user.name || '';
      if (profileDescriptionEl) profileDescriptionEl.textContent = user.about || '';
      closeModal(editProfileModal);
    }).catch(err => console.error('editUserInfo failed', err)).finally(() => {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    });
  });
  editProfileModal?.querySelector('.modal__close-btn')?.addEventListener('click', () => closeModal(editProfileModal));

  // Open new post modal
  newPostBtn?.addEventListener('click', () => openModal(newPostModal));
  newPostModal?.querySelector('.modal__close-btn')?.addEventListener('click', () => closeModal(newPostModal));

  // Global close handler for any close buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close-btn')) {
      const modal = e.target.closest('.modal');
      modal && closeModal(modal);
    }
  });

  // Enable forms validation
  enableValidation(settings);
}

// Example: delegated handler for all like buttons
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.card__like-btn');
  if (!btn) return;
  btn.classList.toggle('card__like-btn_active');
});

