let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("title").value;
  const time = document.getElementById("time").value;

  const task = {
    id: Date.now(),
    title,
    time: Number(time),
    status: "todo"
  };

  tasks.push(task);
  save();
  render();
}

function render() {
  ["todo", "doing", "done"].forEach(col => {
    document.getElementById(col).innerHTML = `<h2>${col.toUpperCase()}</h2>`;
  });

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.id = task.id;
    div.innerText = `${task.title} (${task.time}min)`;

    div.ondragstart = drag;

    document.getElementById(task.status).appendChild(div);
  });

  updateDashboard();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("id");

  const task = tasks.find(t => t.id == id);
  task.status = ev.currentTarget.id;

  save();
  render();
}

function updateDashboard() {
  let total = tasks.reduce((sum, t) => sum + t.time, 0);
  let done = tasks.filter(t => t.status === "done").length;

  document.getElementById("total").innerText = `Tempo total: ${total} min`;
  document.getElementById("doneTasks").innerText = `Concluídas: ${done}`;
}

render();
