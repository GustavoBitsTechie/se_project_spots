// Minimal, robust form validation utilities

export const settings = {
  formSelector: '.modal__form',
  inputSelector: '.modal__input',
  submitButtonSelector: '.modal__submit-btn',
  inactiveButtonClass: 'modal__submit-btn_disabled',
  inputErrorClass: 'modal__input_type_error',
  errorClass: 'modal__error_visible'
};

export function showInputError(formElement, inputElement, settings) {
  if (!formElement || !inputElement) return;
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (inputElement.classList) inputElement.classList.add(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(settings.errorClass);
  }
}

export function hideInputError(formElement, inputElement, settings) {
  if (!formElement || !inputElement) return;
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (inputElement.classList) inputElement.classList.remove(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(settings.errorClass);
  }
}

function hasInvalidInput(inputList) {
  return Array.from(inputList).some((input) => !input.validity.valid);
}

export function toggleButtonState(inputList, buttonElement, settings) {
  if (!buttonElement) return;
  // Skip disabling delete buttons if you want them untouched
  if (buttonElement.classList && buttonElement.classList.contains('modal__delete-btn')) return;

  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = formElement.querySelectorAll(settings.inputSelector);
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  // initial button state
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, settings);
      } else {
        hideInputError(formElement, inputElement, settings);
      }
      toggleButtonState(inputList, buttonElement, settings);
    });
  });

  // prevent submit default to let app handle it
  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
  });
}

export function enableValidation(settingsObj = settings) {
  const forms = Array.from(document.querySelectorAll(settingsObj.formSelector));
  forms.forEach((form) => setEventListeners(form, settingsObj));
}