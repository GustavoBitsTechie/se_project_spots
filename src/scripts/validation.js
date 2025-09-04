export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input-error",
  errorClass: "modal__error",
};

function showInputError(formElement, inputElement, errorMsg, settings) {
    const errorMsgEl = formElement.querySelector(`#${inputElement.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputElement.classList.add(settings.inputErrorClass);
}

const hideInputError = (formElement, inputElement, settings) => {
  const errorMsgEl = formElement.querySelector(`#${inputElement.id}-error`);
  errorMsgEl.textContent = '';
    inputElement.classList.remove(settings.inputErrorClass);
    errorMsgEl.classList.add(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
   if (!inputElement.validity.valid) {
     showInputError(formElement, inputElement, inputElement.validationMessage, settings);
   } else {
    hideInputError(formElement, inputElement, settings);
   }
};

const hasInvalidInput = (inputList) => {
   return inputList.some(inputElement => !inputElement.validity.valid);
};

function toggleButtonState(inputList, buttonElement, settings) {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(settings.inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(settings.inactiveButtonClass);
    }
}

function disableButton(buttonElement, settings) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
}

function resetValidation(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);
    inputList.forEach(inputElement => {
        hideInputError(formElement, inputElement, settings);
    });
    disableButton(buttonElement, settings);
}

function setEventListeners(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, settings);

    inputList.forEach(inputElement => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
}


export const enableValidation = (settings) => {
    const formList = document.querySelectorAll(settings.formSelector);
    formList.forEach((formElement) => {
        setEventListeners(formElement, settings);
        formElement.addEventListener("submit", (evt) => {
            evt.preventDefault();
            const buttonElement = formElement.querySelector(settings.submitButtonSelector);
            disableButton(buttonElement, settings); 
        });
    });
};