const loginButton = document.querySelector(".login-btn");
const loginScreen = document.querySelector(".page-wrap");
const mainMenu = document.getElementById("mainMenu");
const blackMarketBtn = document.getElementById("blackMarketBtn");
const logoutBtn = document.getElementById("logoutBtn");

const historyBtn = document.getElementById("historyBtn");
const historyScreen = document.getElementById("historyScreen");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const blackMarketScreen = document.getElementById("blackMarketScreen");
const blackMarketBackBtn = document.getElementById("blackMarketBackBtn");
const replayPrice = document.getElementById("replayPrice");
const overwritePrice = document.getElementById("overwritePrice");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");


clickSound.volume = 0.3;
bgMusic.volume = 0.04;

let musicStarted = false;

function startMusic() {
  if (musicStarted) return;

  bgMusic.play().then(function () {
    musicStarted = true;
  }).catch(function (error) {
    console.log("Audio could not play yet:", error);
  });
}

document.addEventListener("click", startMusic);

loginButton.addEventListener("click", function () {
  startMusic();

  loginScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

historyBtn.addEventListener("click", function () {
  startMusic();

  mainMenu.classList.add("hidden");
  historyScreen.classList.remove("hidden");
});

backToMenuBtn.addEventListener("click", function () {
  startMusic();

  historyScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

logoutBtn.addEventListener("click", function () {
  mainMenu.classList.add("hidden");
  historyScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  bPresses = 0;
  blackMarketBtn.classList.add("hidden");
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

const blackMarketSound = new Audio("audio/blackmarket.mp3");
blackMarketSound.volume = 0.35;

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Black Market entry button OR any button inside Black Market screen
  if (btn.id === "blackMarketBtn" || btn.closest("#blackMarketScreen")) {
    blackMarketSound.currentTime = 0;
    blackMarketSound.play().catch(() => {});
    return;
  }

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
});

function randomMarketPrice() {
  return Math.floor(Math.random() * 2001) + 1000;
}

function updateBlackMarketPrices() {
  replayPrice.textContent = "$" + randomMarketPrice();
  overwritePrice.textContent = "$" + randomMarketPrice();
}

blackMarketBtn.addEventListener("click", function () {
  mainMenu.classList.add("hidden");
  blackMarketScreen.classList.remove("hidden");
  document.body.classList.add("dark-mode");
  updateBlackMarketPrices();
});

blackMarketBackBtn.addEventListener("click", function () {
  blackMarketScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  document.body.classList.remove("dark-mode");
});
