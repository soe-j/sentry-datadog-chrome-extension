chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
    userId,
    dateLabel: dateElem.textContent,
  });
});
