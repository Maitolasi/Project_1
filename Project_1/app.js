

let entries = [];
let selectedMood = "";



document.addEventListener("DOMContentLoaded", function () {
  loadFromStorage();
  renderEntries();
  updateStats();
});


let moodButtons = document.querySelectorAll(".moods button");

for (let i = 0; i < moodButtons.length; i++) {
  moodButtons[i].addEventListener("click", function () {
    selectedMood = this.dataset.mood;


    for (let j = 0; j < moodButtons.length; j++) {
      moodButtons[j].classList.remove("active");
    }

    this.classList.add("active");
  });
}


document.getElementById("entryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let activityInput = document.getElementById("activity");
  let activity = activityInput.value;

  if (activity === "" || selectedMood === "") {
    alert("please select mood and write something");
    return;
  }

  let entry = {
    id: Date.now(),
    mood: selectedMood,
    activity: activity,
    date: new Date().toLocaleDateString()
  };

  entries.push(entry);

  saveToStorage();
  renderEntries();
  updateStats();

  activityInput.value = "";
});




function renderEntries() {
  let list = document.getElementById("entries");
  list.innerHTML = "";

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    let li = document.createElement("li");

    let text = entry.date + " - " + entry.mood + " - " + entry.activity;
    li.textContent = text;

    let btn = document.createElement("button");
    btn.textContent = "Delete";

    btn.addEventListener("click", function () {
      deleteEntry(entry.id);
    });

    li.appendChild(btn);
    list.appendChild(li);
  }
}


function deleteEntry(id) {
  let newList = [];

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].id !== id) {
      newList.push(entries[i]);
    }
  }

  entries = newList;

  saveToStorage();
  renderEntries();
  updateStats();
}


document.getElementById("filterMood").addEventListener("change", function () {
  applyFilters();
});


document.getElementById("search").addEventListener("input", function () {
  applyFilters();
});

function applyFilters() {
  let mood = document.getElementById("filterMood").value;
  let search = document.getElementById("search").value.toLowerCase();

  let filtered = [];

  for (let i = 0; i < entries.length; i++) {
    let e = entries[i];

    let moodMatch = (mood === "all" || e.mood === mood);
    let searchMatch = e.activity.toLowerCase().includes(search);

    if (moodMatch && searchMatch) {
      filtered.push(e);
    }
  }

  let list = document.getElementById("entries");
  list.innerHTML = "";

  for (let i = 0; i < filtered.length; i++) {
    let li = document.createElement("li");

    let text = filtered[i].date + " - " + filtered[i].mood + " - " + filtered[i].activity;
    li.textContent = text;

    list.appendChild(li);
  }
}

function updateStats() {
  let statsDiv = document.getElementById("stats");

  statsDiv.textContent = "Total entries: " + entries.length;
  
}


function saveToStorage() {
  localStorage.setItem("entries", JSON.stringify(entries));
}


function loadFromStorage() {
  let data = localStorage.getItem("entries");

  if (data) {
    entries = JSON.parse(data);
  } else {
    entries = [];
  }
}