chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const envElem = document.querySelector('[aria-label="environment"]');
  if (!envElem) {
    alert('Not found [aria-label="environment"] Element');
    return;
  }
  const env = envElem.innerText.split("\n")[1];

  const userIdElem = document.querySelector(
    '[data-test-id="user-context-id-value"]'
  );
  const userId = userIdElem ? userIdElem.textContent : null;

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
