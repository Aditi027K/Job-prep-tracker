// script.js

function addProblem() {
  const input = document.getElementById("problem");
  const value = input.value.trim();

  if (!value) return;

  fetch("http://localhost:3000/add-problem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: value })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      showProblemOnScreen({ id: data.id, title: value });
      input.value = "";
    })
    .catch(err => {
      alert("Something went wrong.");
      console.error(err);
    });
}

function showProblemOnScreen(problem) {
  const list = document.getElementById("problemList");
  const li = document.createElement("li");

  const link = document.createElement("a");
  link.href = `view.html?id=${problem.id}`;
  link.textContent = problem.title;
  link.style.marginRight = "10px";

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.onclick = (e) => {
    e.preventDefault(); // Prevent link click
    deleteProblem(problem.id, li);
  };

  li.appendChild(link);
  li.appendChild(delBtn);
  list.appendChild(li);
}

function loadAllProblems() {
  fetch("http://localhost:3000/problems")
    .then(res => res.json())
    .then(data => {
      data.forEach((problem) => showProblemOnScreen(problem));
    })
    .catch(err => console.error("Error loading problems:", err));
}

function deleteProblem(id, listItem) {
  fetch(`http://localhost:3000/problem/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      listItem.remove();
    })
    .catch(err => console.error("Error deleting problem:", err));
}

window.onload = loadAllProblems;
