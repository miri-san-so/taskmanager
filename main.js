function idGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4();
}

function getCookies() {
  cookies = document.cookie.split("~");
  if (cookies.length > 1) {
    cookies.pop();
  }
  return cookies;
}

function getAllTasksInfo() {
  allTasks = [];
  if (getCookies()[0] != "") {
    getCookies().forEach(element => {
      allTasks.push(JSON.parse(element));
    });
    return allTasks;
  }
  return null;
}

function addOldTasks() {
  mid = document.querySelector(".mid");
  tasks = getAllTasksInfo();
  if (tasks != null) {
    tasks.forEach(element => {
      task_card = createOldCard(
        element["_taskName"],
        element["_taskTime"],
        element["id"],
        element["completed"]
      );
      mid.appendChild(task_card);
      if (element["completed"] == true) {
        styleCompletedTask(element["id"]);
      }
    });
  }
  setHours();
}

function createOldCard(_taskName, _taskTime, _id, _completed) {
  let id = _id;
  card = document.createElement("div");
  card.id = id;
  card.innerHTML = `<div class="card-header">
  <p>${_taskName}</p>
  </div>
  <div class="card-footer">
  <div class="timestamp">
    <p>
    ${_taskTime}
    </p>
  </div>
  <div class="controls">
    <button onclick="remove('${id}')" class="remove">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="remove">
          <path
            id="Vector 2"
            d="M1 1L12.5 12.5"
            stroke="#C1002D"
            stroke-width="2"
          />
          <path
            id="Vector 3"
            d="M12.5 1L0.999999 12.5"
            stroke="#C1002D"
            stroke-width="2"
          />
        </g>
      </svg>
    </button>
    <button onclick="completed('${id}')" class="completed">
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="completed"
          d="M1 6.67742L6.21739 12L17 1"
          stroke="#64F78B"
          stroke-width="2"
        />
      </svg>
    </button>
  </div>
  </div>`;
  card.className = "task-card";

  return card;
}

function createCard(_taskName, _taskTime) {
  let id = idGenerator();
  document.cookie +=
    JSON.stringify({
      id,
      _taskName,
      _taskTime,
      completed: "false"
    }) + "~";
  card = document.createElement("div");
  card.id = id;
  card.innerHTML = `<div class="card-header">
  <p>${_taskName}</p>
  </div>
  <div class="card-footer">
  <div class="timestamp">
    <p>
    ${_taskTime}
    </p>
  </div>
  <div class="controls">
    <button onclick="remove('${id}')" class="remove">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="remove">
          <path
            id="Vector 2"
            d="M1 1L12.5 12.5"
            stroke="#C1002D"
            stroke-width="2"
          />
          <path
            id="Vector 3"
            d="M12.5 1L0.999999 12.5"
            stroke="#C1002D"
            stroke-width="2"
          />
        </g>
      </svg>
    </button>
    <button onclick="completed('${id}')" class="completed">
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="completed"
          d="M1 6.67742L6.21739 12L17 1"
          stroke="#64F78B"
          stroke-width="2"
        />
      </svg>
    </button>
  </div>
  </div>`;
  card.className = "task-card";
  setHours();
  return card;
}

function modal() {
  modalDiv = document.querySelector(".modal");
  addBtn = document.querySelector(".addBtn");

  if (modalDiv.getAttribute("clicked") == "false") {
    modalDiv.style.display = "flex";
    modalDiv.className = "modal animDown";
    modalDiv.setAttribute("clicked", "true");
    addBtn.setAttribute("style", "transform: rotate(45deg); color: #c1002d");
  } else {
    modalDiv.style.display = "none";
    modalDiv.className = "modal animUp";
    modalDiv.setAttribute("clicked", "false");
    addBtn.setAttribute("style", "transform: rotate(0deg); color: #8e8e8e");
  }
}

function getData() {
  mid = document.querySelector(".mid");
  task_name = document.querySelector(".center").children[1].value;
  task_name = task_name.trim();
  time = document.querySelector(".center").children[3].value;
  error = document.querySelector("span.error");
   if (task_name != "" && time != "") {
    let chk = /\s|[0-9]{0,2}:[0-6]|[0-9]/;
    time = time.trim();
    time = time.replace(/ /g, '');
    a = time.split(":");
    if (a[0] == "") {
      a[0] = 0;
    }
    if (a[1] == "" || a[1] == undefined) {
      a[1] = 0;
    }

    if (isNaN(a[0].trim()) == false && isNaN(a[1].trim()) == false) {
      if (chk.test(time)) {
        modalDiv.style.display = "none";
        modalDiv.className = "modal animUp";
        modalDiv.setAttribute("clicked", "false");
        addBtn.setAttribute("style", "transform: rotate(0deg); color: #8e8e8e");
        let timestamp = a[0] + " Hours " + a[1] + " Minutes";
        task_card = createCard(task_name, timestamp);

        mid.appendChild(task_card);
      } else {
        error.innerText = "Enter a valid time [ format > HH:MM ]";
        error.style.opacity = "1";
      }
    } else {
      error.innerText = "Please fill all fields";
      error.style.opacity = "1";
    }
  }


}

function remove(id) {
  card = document.getElementById(id);
  Taskid = card.getAttribute("id");
  tasks = getAllTasksInfo();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == Taskid) {
      tasks.splice(i, 1);
    }

    newCookies = "";

    tasks.forEach(elem => {
      newCookies += JSON.stringify(elem) + "~";
    });
    document.cookie = newCookies;
  }
  card.remove();
  setHours();
}

function styleCompletedTask(id) {
  card = document.getElementById(id);
  card.style.border = "1px solid #64e6a9";
  card.children[1].children[0].style.color = "#64e6a9";
  card.children[1].children[0].innerText = "Completed";
  card.children[1].children[1].children[1].style.display = "none";
  card.setAttribute(
    "style",
    "flex-direction: row; height: fit-content; justify-content: space-between;"
  );
  card.children[1].style.flexGrow = "0";
  card.children[1].style.padding = "2px 4px";
  card.children[1].style.width = "50%";
  card.children[1].children[0].style.width = "100%";
  card.children[1].children[0].style.padding = "0";
  card.children[1].children[0].style.textAlign = "center";
  card.children[1].children[0].style.display = "flex";
  card.children[1].children[0].style.justifyContent = "center";
  card.style.alignItems = "center";
}

function completed(id) {
  tasks = getAllTasksInfo();
  Taskid = id;
  styleCompletedTask(id);
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == Taskid) {
      tasks[i]["completed"] = true;
    }

    newCookies = "";

    tasks.forEach(elem => {
      newCookies += JSON.stringify(elem) + "~";
    });

    document.cookie = newCookies;
    setHours();
  }
}

function getHoursFromCookies() {
  hours = 0;
  minutes = 0;
  tasks = getAllTasksInfo();
  if (tasks != null) {
    tasks.forEach(element => {
      if (element["completed"] == "false") {
        hours += parseInt(element["_taskTime"].split(" ")[0]);
        minutes += parseInt(element["_taskTime"].split(" ")[2]);
      }
    });
    return [hours, minutes];
  } else {
    return [0, 0];
  }
}

function setHours() {
  time = document.querySelector(".info span");
  timeValue = getHoursFromCookies();
  if (timeValue != null) {
    if (isNaN(timeValue[0])) {
      timeValue[0] = 0;
    }
    if (isNaN(timeValue[1])) {
      timeValue[0] = 0;
    }
    time.innerText = timeValue[0] + " HOURS " + timeValue[1] + " MINS";
  }
}
