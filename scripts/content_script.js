chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const envElem = document.querySelector('[aria-label="environment"]');
  if (!envElem) {
    if (!window.confirm("envElem is not found. continue?")) {
      return;
    }
  }
  const env = (() => {
    if (!envElem) return null;
    const envRaw = envElem.innerText.split("\n")[1];
    if (envRaw.includes("develop")) return "develop";
    return envRaw;
  })();

  const userIdElem = document
    .querySelector('[data-sentry-element="CardPanel"]')
    ?.querySelector('[data-sentry-element="ValueSection"]');

  if (!userIdElem) {
    if (!window.confirm("userIdElem is not found. continue?")) {
      return;
    }
  }

  const userId = userIdElem ? userIdElem.innerText : null;

  const dateElem = document.querySelector('[data-sentry-component="DateTime"]');
  if (!dateElem) {
    if (!window.confirm("dateElem is not found. continue?")) {
      return;
    }
  }
  const dateLabel = dateElem ? dateElem.textContent : null;

  sendResponse({
    env,
    userId,
    dateLabel,
  });
});
