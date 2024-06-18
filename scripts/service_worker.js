chrome.runtime.onMessage.addListener(async (message) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.tabs.sendMessage(tab.id, {}).catch((reason) => {
    console.log(reason);
    return null;
  });
  if (!result) return;
  const { env, userId, dateLabel } = result;

  if (!dateLabel) {
    openTab({
      query: message.query.tags,
      paused: false,
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

  const query = [
    message.query.tags,
    env ? `env:${env}` : null,
    userId ? `${message.query.userIdKey}:${userId}` : null,
  ]
    .filter((v) => v)
    .join(" ");

  openTab({
    query,
    start: startDate.getTime(),
    end: endDate.getTime(),
    paused: true,
  });
});

const openTab = (query) => {
  const params = new URLSearchParams(query);
  const url = `https://app.datadoghq.com/apm/traces?${params}`;
  chrome.tabs.create({ url });
};
