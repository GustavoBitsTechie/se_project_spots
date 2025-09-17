export function setButtonText(button, isLoading, loadingText = 'Saving...', defaultText = 'Save') {
  if (!button) return;
  if (button.tagName.toLowerCase() === 'input') {
    button.value = isLoading ? loadingText : defaultText;
  } else {
    button.textContent = isLoading ? loadingText : defaultText;
  }
  button.disabled = isLoading;
}