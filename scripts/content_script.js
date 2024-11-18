chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const projectName = Array.from(
    document.querySelectorAll('a[href^="/projects"]')
  )
    .flatMap((e) => new URL(e.href).pathname.match(/\/projects\/(.+)\//) ?? [])
    .find((path) => !path.includes("/projects/"));
  console.log({ projectName });

  const envElem = document.querySelector('[aria-label="environment"]');
  const env = (() => {
    if (!envElem) return null;
    const envRaw = envElem.innerText.split("\n")[1];
    if (envRaw.includes("develop")) return "develop";
    return envRaw;
  })();
  console.log({ env });

  const userParams = document
    .querySelector('[data-sentry-element="CardPanel"]')
    ?.querySelectorAll('[data-sentry-element="ContentWrapper"]');

  const userIdElem = Array.from(userParams).find((e) => {
    return e.innerText.split("\n")[0] === "ID";
  });
  const userId = userIdElem ? userIdElem.innerText.split("\n")[1] : null;
  console.log({ userId });

  const dateElem = document.querySelector('[data-sentry-component="DateTime"]');
  const dateLabel = dateElem ? dateElem.textContent : null;
  console.log({ dateLabel });

  sendResponse({
    projectName,
    env,
    userId,
    dateLabel,
  });
});
