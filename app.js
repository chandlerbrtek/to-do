const STORAGE_KEY = "todos";

const form = document.getElementById("new-todo-form");
const input = document.getElementById("new-todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");

let todos = loadTodos();

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage can be blocked (e.g. private browsing); the app still works for this visit.
  }
}

function render() {
  list.innerHTML = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "todo-" + todo.id;
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveTodos();
      render();
    });

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "Delete " + todo.text);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      render();
    });

    item.append(checkbox, label, deleteButton);
    list.append(item);
  }

  emptyMessage.hidden = todos.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  render();
  input.value = "";
  input.focus();
});

render();
