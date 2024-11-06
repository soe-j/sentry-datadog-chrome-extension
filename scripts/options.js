const renderQueries = async () => {
  state.queriesBox.innerHTML = null;

  state.queries.forEach((query) => {
    const row = document.createElement("div");
    row.classList.add("row");

    const execBtn = document.createElement("button");
    execBtn.classList.add("btn", "exec-btn");
    execBtn.innerText = `${query.sentryProject} → ${query.tags} ${query.userIdKey}`;
    row.appendChild(execBtn);

    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "del-btn");
    delBtn.innerText = "x";
    delBtn.addEventListener("click", () => {
      setQueries(
        state.queries.filter((q) => {
          if (q.sentryProject !== query.sentryProject) return true;
          if (q.tags !== query.tags) return true;
          if (q.userIdKey !== query.userIdKey) return true;
          return false;
        })
      );
      renderQueries();
    });
    row.appendChild(delBtn);

    state.queriesBox.appendChild(row);
  });
};

const state = {
  queriesBox: null,
  queries: [],
};

const fetchQueries = async () => {
  state.queries = await (async () => {
    const result = await chrome.storage.local.get(["queries"]);
    return result.queries || [];
  })();
};

const setQueries = async (queries) => {
  state.queries = queries;
  chrome.storage.local.set({ queries });
};

document.addEventListener("DOMContentLoaded", async () => {
  const sentryProjectInput = document.getElementById("sentry-project-input");
  const queryInput = document.getElementById("query-input");
  const userIdKeyInput = document.getElementById("user-id-key-input");
  state.queriesBox = document.getElementById("queries-box");

  await fetchQueries();
  renderQueries();

  const handler = (e) => {
    if (e.code !== "Enter") return;

    setQueries([
      ...state.queries,
      {
        sentryProject: sentryProjectInput.value,
        tags: queryInput.value,
        userIdKey: userIdKeyInput.value,
      },
    ]);
    renderQueries();

    sentryProjectInput.value = "";
    queryInput.value = "";
    userIdKeyInput.value = "";
  };

  sentryProjectInput.addEventListener("keydown", handler);
  queryInput.addEventListener("keydown", handler);
  userIdKeyInput.addEventListener("keydown", handler);
});
