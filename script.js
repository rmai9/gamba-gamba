const loginButton = document.querySelector(".login-btn");
const loginScreen = document.querySelector(".page-wrap");
const mainMenu = document.getElementById("mainMenu");
const blackMarketBtn = document.getElementById("blackMarketBtn");

const historyBtn = document.getElementById("historyBtn");
const historyScreen = document.getElementById("historyScreen");
const backToMenuBtn = document.getElementById("backToMenuBtn");

loginButton.addEventListener("click", function () {
  loginScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

historyBtn.addEventListener("click", function () {
  mainMenu.classList.add("hidden");
  historyScreen.classList.remove("hidden");
});

backToMenuBtn.addEventListener("click", function () {
  historyScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

let bPresses = 0;

document.addEventListener("keydown", function (event) {
  if (event.key.toLowerCase() === "b") {
    bPresses++;

    if (bPresses >= 3) {
      blackMarketBtn.classList.remove("hidden");
    }
  }
});

function renderMatchHistory(matches) {
  const tableBody = document.getElementById("historyTableBody");
  const emptyMsg = document.getElementById("emptyHistoryMsg");

  tableBody.innerHTML = "";

  if (!matches || matches.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  matches.forEach((match, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="${match.result === "win" ? "win" : "loss"}">
        ${match.result.toUpperCase()}
      </td>
      <td>${match.player}</td>
      <td>${match.opponent}</td>
      <td class="${match.result === "win" ? "win" : "loss"}">
        ${match.money}
      </td>
    `;

    tableBody.appendChild(row);
  });
}