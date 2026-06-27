let data;
let dragId = null;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function init() {
  const saved = safeParse(localStorage.getItem("devboard"));

  if (saved && saved.boards) {
    data = saved;
  } else {
    data = {
      boards: { "Meu Board": [] },
      current: "Meu Board",
      theme: "dark"
    };
  }

  if (!data.boards[data.current]) {
    data.current = Object.keys(data.boards)[0];
  }

  applyTheme();
  updateBoards();
  setupDnD();
  render();
}

function save() {
  localStorage.setItem("devboard", JSON.stringify(data));
}

function createBoard() {
  const name = document.getElementById("boardName").value.trim();

  if (!name || data.boards[name]) return;

  data.boards[name] = [];
  data.current = name;

  document.getElementById("boardName").value = "";

  save();
  updateBoards();
  render();
}

function updateBoards() {
  const select = document.getElementById("boardSelect");
  select.innerHTML = "";

  Object.keys(data.boards).forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.innerText = b;
    select.appendChild(opt);
  });

  select.value = data.current;

  select.onchange = () => {
    data.current = select.value;
    save();
    render();
  };
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const time = Number(document.getElementById("taskTime").value);
  const type = document.getElementById("taskType").value;

  if (!title || !time || time <= 0) return;

  data.boards[data.current].push({
    id: crypto.randomUUID(),
    title,
    time,
    type,
    status: "todo"
  });

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskTime").value = "";

  save();
  render();
}

function render() {
  ["todo","doing","done"].forEach(c => {
    const col = document.getElementById(c);
    col.innerHTML = `<h2>${c.toUpperCase()}</h2>`;
  });

  const tasks = data.boards[data.current] || [];

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task";
    div.dataset.id = t.id;
    div.draggable = true;

    div.innerText = `${t.title} (${t.time}min - ${t.type})`;

    div.addEventListener("dragstart", () => {
      dragId = t.id;
    });

    document.getElementById(t.status).appendChild(div);
  });

  updateChartSafe(tasks);
}

function setupDnD() {
  ["todo","doing","done"].forEach(id => {
    const col = document.getElementById(id);

    col.addEventListener("dragover", e => e.preventDefault());

    col.addEventListener("drop", () => {
      if (!dragId) return;

      const task = data.boards[data.current].find(t => t.id === dragId);
      if (!task) return;

      task.status = id;

      dragId = null;
      save();
      render();
    });
  });
}

function toggleTheme() {
  data.theme = data.theme === "dark" ? "light" : "dark";
  applyTheme();
  save();
}

function applyTheme() {
  document.body.classList.toggle("light", data.theme === "light");
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "devboard.json";
  a.click();

  URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", init);
