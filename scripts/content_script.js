chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const envElem = document.querySelector('[aria-label="environment"]');
  if (!envElem) {
    alert('Not found [aria-label="environment"] Element');
    return;
  }
  const envRaw = envElem.innerText.split("\n")[1];
  const env = (() => {
    if (envRaw.includes("develop")) return "develop";
    return envRaw;
  })();

  const userIdElem = document
    .querySelector('[data-sentry-element="CardPanel"]')
    .querySelector('[data-sentry-element="ValueSection"]');

  if (!userIdElem) {
    if (!window.confirm("userIdElem not found. continue?")) {
      return;
    }
  }

  const userId = userIdElem ? userIdElem.innerText : null;

  const dateElem = document.querySelector("time");
  if (!dateElem) {
    alert("Not found <time> Element");
    return;
  }

  sendResponse({
    env,
    userId,
    dateLabel: dateElem.textContent,
  });
});
