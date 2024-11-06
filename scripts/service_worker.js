chrome.action.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.tabs.sendMessage(tab.id, {}).catch((reason) => {
    console.log(reason);
    return null;
  });
  if (!result) return;
  const { env, userId, dateLabel, projectName } = result;

  const savedQueries = await fetchQueries();
  console.log({ savedQueries });

  const targetQuery = savedQueries.find((q) => q.sentryProject === projectName);
  if (!targetQuery) {
    console.log(`query not found for ${projectName}`);
    openTab({
      live: false,
    });
    return;
  }

  const query = [
    targetQuery.tags,
    env ? `env:${env}` : null,
    userId ? `${targetQuery.userIdKey}:${userId}` : null,
  ]
    .filter((v) => v)
    .join(" ");

  if (!dateLabel) {
    openTab({
      query,
      live: false,
    });
    return;
  }

  const [dateStr, timeStr] = dateLabel.split(", ");
  const today = new Date();
  const eventDate = new Date(`${dateStr} ${today.getFullYear()} ${timeStr}`);

  const startDate = new Date(eventDate);
  startDate.setMinutes(eventDate.getMinutes() - 0);

  const endDate = new Date(eventDate);
  endDate.setMinutes(eventDate.getMinutes() + 2);

  openTab({
    query,
    from_ts: startDate.getTime(),
    to_ts: endDate.getTime(),
    live: false,
  });
});

const openTab = (query) => {
  const params = new URLSearchParams(query);
  const url = `https://app.datadoghq.com/logs?${params}`;
  chrome.tabs.create({ url });
};

const fetchQueries = async () => {
  const result = await chrome.storage.local.get(["queries"]);
  return result.queries || [];
};
