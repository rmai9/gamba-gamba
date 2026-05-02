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

const signupBox = document.querySelector(".signup-box");
const signupButton = document.querySelector(".signup-btn");
const createAccountBtn = document.getElementById("createAccountBtn");
const backToLoginBtn = document.getElementById("backToLoginBtn");
const loginMessage = document.getElementById("loginMessage");

const passwordToggle = document.getElementById("passwordToggle");
const signupPasswordToggle = document.getElementById("signupPasswordToggle");

const bgMusic = document.getElementById("bgMusic");
const blackMarketMusic = document.getElementById("blackMarketMusic");
const clickSound = document.getElementById("clickSound");

clickSound.volume = 0.3;
bgMusic.volume = 0.04;
blackMarketMusic.volume = 0.04;

const blackMarketSound = new Audio("static/audio/blackmarket.mp3");
blackMarketSound.volume = 0.35;

let musicStarted = false;
let currentMusic = bgMusic;

function startMusic() {
  if (musicStarted) return;

  bgMusic.play().then(function () {
    musicStarted = true;
    currentMusic = bgMusic;
  }).catch(function (error) {
    console.log("Audio could not play yet:", error);
  });
}

function playMenuMusic() {
  if (!musicStarted) return;

  blackMarketMusic.pause();

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }

  currentMusic = bgMusic;
}

function playBlackMarketMusic() {
  if (!musicStarted) return;

  bgMusic.pause();

  if (blackMarketMusic.paused) {
    blackMarketMusic.play().catch(() => {});
  }

  currentMusic = blackMarketMusic;
}

document.addEventListener("click", startMusic);

let rememberUsernameOnLogout = false;

loginButton.addEventListener("click", async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberCheckbox = document.getElementById("rememberCheckbox");

  if (!username || !password) {
  showLoginMessage("Please enter username and password");
  return;
  }

  rememberUsernameOnLogout = rememberCheckbox.checked;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      startMusic();
      loginScreen.classList.add("hidden");
      mainMenu.classList.remove("hidden");
      playMenuMusic();
    } else {
      showLoginMessage(data.error || "Login failed");
    }
  } catch (error) {
    showLoginMessage("Network error");
  }
});

createAccountBtn.addEventListener("click", function () {
  loginScreen.querySelector(".login-box").classList.add("hidden");
  signupBox.classList.remove("hidden");
});

backToLoginBtn.addEventListener("click", function () {
  signupBox.classList.add("hidden");
  loginScreen.querySelector(".login-box").classList.remove("hidden");
});

passwordToggle.addEventListener("click", function (e) {
  e.preventDefault();
  const passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordToggle.textContent = "⌣";
  } else {
    passwordInput.type = "password";
    passwordToggle.textContent = "👁";
  }
});

signupPasswordToggle.addEventListener("click", function (e) {
  e.preventDefault();
  const passwordInput = document.getElementById("signup-password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    signupPasswordToggle.textContent = "⌣";
  } else {
    passwordInput.type = "password";
    signupPasswordToggle.textContent = "👁";
  }
});

signupButton.addEventListener("click", async function () {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created! Click 'Back to Login' to login.");
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (error) {
    alert("Network error");
  }
});

historyBtn.addEventListener("click", function () {
  startMusic();

  mainMenu.classList.add("hidden");
  historyScreen.classList.remove("hidden");

  playMenuMusic();
});

backToMenuBtn.addEventListener("click", function () {
  startMusic();

  historyScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");

  playMenuMusic();
});

logoutBtn.addEventListener("click", async function () {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch (error) {
    // ignore
  }

  mainMenu.classList.add("hidden");
  historyScreen.classList.add("hidden");
  blackMarketScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  document.body.classList.remove("dark-mode");

  bPresses = 0;
  blackMarketBtn.classList.add("hidden");

  // Clear login form
  if (!rememberUsernameOnLogout) {
    document.getElementById("username").value = "";
  }
  document.getElementById("password").value = "";
  document.getElementById("rememberCheckbox").checked = false;
  rememberUsernameOnLogout = false;

  playMenuMusic();
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

function randomMarketPrice() {
  return Math.floor(Math.random() * 2001) + 1000;
}

function updateBlackMarketPrices() {
  replayPrice.textContent = "$" + randomMarketPrice();
  overwritePrice.textContent = "$" + randomMarketPrice();
}

blackMarketBtn.addEventListener("click", function () {
  startMusic();

  mainMenu.classList.add("hidden");
  blackMarketScreen.classList.remove("hidden");

  document.body.classList.add("dark-mode");

  playBlackMarketMusic();
  updateBlackMarketPrices();
});

blackMarketBackBtn.addEventListener("click", function () {
  blackMarketScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");

  document.body.classList.remove("dark-mode");

  playMenuMusic();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.id === "blackMarketBtn" || btn.closest("#blackMarketScreen")) {
    blackMarketSound.currentTime = 0;
    blackMarketSound.play().catch(() => {});
    return;
  }

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
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

async function checkLogin() {
  try {
    const response = await fetch('/api/me');
    if (response.ok) {
      loginScreen.classList.add("hidden");
      mainMenu.classList.remove("hidden");
    }
  } catch (error) {
    // not logged in
  }
}

function showLoginMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.classList.remove("hidden", "success");

  if (type === "success") {
    loginMessage.classList.add("success");
  }
}

window.addEventListener("load", checkLogin);