const loginButton = document.querySelector(".login-btn");
const loginScreen = document.querySelector(".page-wrap");
const mainMenu = document.getElementById("mainMenu");
const blackMarketBtn = document.getElementById("blackMarketBtn");
const logoutBtn = document.getElementById("logoutBtn");

const historyBtn = document.getElementById("historyBtn");
const historyScreen = document.getElementById("historyScreen");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const mainMenuMarquee = document.getElementById("mainMenuMarquee");

const userBanner = document.getElementById("userBanner");

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

const playBtn = document.getElementById("playBtn");
const matchmakingPopup = document.getElementById("matchmakingPopup");
const matchmakingPopup2 = document.getElementById("matchmakingPopup2");
const victoryPopup = document.getElementById("victoryPopup");

const playScreen = document.getElementById("playScreen");
const playArea = document.getElementById("playArea");
const rockBtn = document.getElementById("rockBtn");
const paperBtn = document.getElementById("paperBtn");
const scissorsBtn = document.getElementById("scissorsBtn");
const countdownPopup = document.getElementById("countdownPopup");
const playerSelection = document.getElementById("playerSelection");
const enemySelection = document.getElementById("enemySelection");

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

  renderMatchHistory();
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
  return Math.floor(Math.random() * 2001) + 100;
}

document.getElementById("buyReplayBtn").addEventListener("click", function () {purchasePowerup("replay")});
document.getElementById("buyOverwriteBtn").addEventListener("click", function () {purchasePowerup("overwrite")});

async function purchasePowerup(powerupType) {
  const response = await fetch(`/api/playerInfo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  purchasePrice = powerupType === "replay" ? parseInt(replayPrice.textContent.replace("$", "")) : parseInt(overwritePrice.textContent.replace("$", ""));
  const data = await response.json();

  if (data.money >= purchasePrice) {
    const newPowerups = data.powerups + 1;
    const newMoney = data.money - purchasePrice;

    const purchaseResponse = await fetch('/api/buyPowerup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ powerupType, newPowerups, newMoney })
    });
    loadProfile();
  } else {
    alert("Not enough money to purchase this power-up!");
  }
}

async function updateBlackMarketPrices() {
  while (blackMarketScreen.classList.contains("hidden") === false) {
    replayPrice.textContent = "$" + randomMarketPrice();
    overwritePrice.textContent = "$" + randomMarketPrice();
    await sleep(500);
  }
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

async function renderMatchHistory() {
  const tableBody = document.getElementById("historyTableBody");
  const emptyMsg = document.getElementById("emptyHistoryMsg");

  tableBody.innerHTML = "";

  const response = await fetch('/api/matchHistory', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log("Fetching match history...");
  
  const data = await response.json();

  matches = data.matches;

  console.log("Match history data:", data.matches);

  if (!matches || matches.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  totalWins=0;
  totalLosses=0;
  totalDraws=0;

  matches.forEach((match, index) => {
    console.log("Processing match:", match);
    const row = document.createElement("tr");

    if (match.p1id === data.userId) {
      switch (match.victor) {
        case 1:
          match.victor = "win";
          totalWins++;
          break;
        case 2:
          match.victor = "loss";
          totalLosses++;
          break;
        default:
          match.victor = "draw";
          totalDraws++;
      }
      match.money = match.p1money;
    } else {
      switch (match.victor) {
        case 1:
          match.victor = "loss";
          totalLosses++;
          break;
        case 2:
          match.victor = "win";
          totalWins++;
          break;
        default:
          match.victor = "draw";
          totalDraws++;
      }
      match.money = match.p2money;
    }


    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="${match.victor === "win" ? "win" : "loss"}">
        ${match.victor.toUpperCase()}
      </td>
      <td>${match.playerName}</td>
      <td>${match.otherName}</td>
      <td class="${match.victor === "win" ? "win" : "loss"}">
        ${match.money}
      </td>
    `;

    tableBody.appendChild(row);


  });

  const response2 = await fetch(`/api/playerInfo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data2 = await response2.json();

  document.getElementById("totalWins").textContent = totalWins;
  document.getElementById("totalLosses").textContent = totalLosses;
  document.getElementById("totalDraws").textContent = totalDraws;
  money = data2.money - 1000; // Subtract starting money to show net gain/loss
  document.getElementById("netMoney").textContent = "$" + money;
}

async function checkLogin() {
  try {
    const response = await fetch('/api/me');
    if (response.ok) {
      loginScreen.classList.add("hidden");
      mainMenu.classList.remove("hidden");
      userBanner.classList.remove("hidden");
      loadProfile();
      playMenuMusic();
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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


playBtn.addEventListener("click", async function () {
  if (musicStarted) {
    bgMusic.pause();
  }

  matchmakingPopup.classList.remove("hidden");
  mainMenu.classList.add("hidden");
  userBanner.classList.add("hidden");

  randval = Math.random() * 500 + 100; // 2-4 seconds

  const response  = await fetch('/api/findMatch', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  
  const response2  = await fetch('/api/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  });

  const data2 = await response2.json();

  const response3 = await fetch(`/api/playerInfo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data3 = await response3.json();


  await sleep(randval);

  

  matchmakingPopup.classList.add("hidden");
  document.getElementById("oppfound").textContent = "Opponent: " + data.username;
  matchmakingPopup2.classList.remove("hidden");

  await sleep(1500);

  matchmakingPopup2.classList.add("hidden");
  playScreen.classList.remove("hidden");
  

  console.log("Matched with:", data.username);
  console.log("Your username:", data2.user.username);

  enemyBanner = document.getElementById("enemy-banner");
  playerBanner = document.getElementById("player-banner");

  enemyBanner.querySelector("p").textContent = data.username;
  playerBanner.querySelector("p").textContent = data2.user.username;
  enemyBanner.querySelector("img").src = getProfilePicture(data.pfp);
  playerBanner.querySelector("img").src = getProfilePicture(data3.pfp);
  enemyBanner.style.backgroundImage = "url('" + getProfileBanner(data.banner) + "')";
  playerBanner.style.backgroundImage = "url('" + getProfileBanner(data3.banner) + "')";


  moveSelected = null;

  rockBtn.disabled = false;
  paperBtn.disabled = false;
  scissorsBtn.disabled = false;

  rockBtn.addEventListener("click", function() {
    moveSelected = 1;
  });
  paperBtn.addEventListener("click", function() {
    moveSelected = 2;
  });
  scissorsBtn.addEventListener("click", function() {
    moveSelected = 3;
  });

  while (!moveSelected) {
    await sleep(100);
  }

  rockBtn.disabled = true;
  paperBtn.disabled = true;
  scissorsBtn.disabled = true;
  playArea.classList.add("hidden");

  countdownPopup.classList.remove("hidden");
  const timer = document.getElementById("countdownTimer");
  let count = 3;
  timer.textContent = count;

  const countdownInterval = setInterval(() => {
    count--;
    timer.textContent = count;
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownPopup.classList.add("hidden");
    }
  }, 500);

  await sleep(1500);

  playerSelection.classList.remove("hidden");
  enemySelection.classList.remove("hidden");

  switch (moveSelected) {
    case 1:
      playerSelection.querySelector("p").textContent = "✊";
      break;
    case 2:
      playerSelection.querySelector("p").textContent = "✋";
      break;
    case 3:
      playerSelection.querySelector("p").textContent = "✌️";
      break;
  }

  switch (data.selection) {
    case 1:
      enemySelection.querySelector("p").textContent = "✊";
      break;
    case 2:
      enemySelection.querySelector("p").textContent = "✋";
      break;
    case 3:
      enemySelection.querySelector("p").textContent = "✌️";
      break;
  }

  winner = determineWinner(moveSelected, data.selection);

  victoryPopup.classList.remove("hidden");
  const vDisplay = document.getElementById("vDisplay");

  if (winner === "win") {
    vDisplay.textContent = "You win!";
  } else if (winner === "loss") {
    vDisplay.textContent = "You lose!";
  } else {
    vDisplay.textContent = "It's a draw!";
  }

  console.log("powerups available:", data3.powerups);
  if (winner != "win" && data3.powerups > 0) {
    powerupsLeft = data3.powerups-1;
    winner = "win";
    vDisplay.textContent = "Cheated!";
    const response4 = await fetch('/api/usePowerup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPowerups: powerupsLeft })
    });
  }


  moneyChange = determineMoneyChange(winner, data3.money, data.money);

  document.getElementById("vMoney").textContent = (moneyChange >= 0 ? "You won $" : "You lost $") + Math.abs(moneyChange) + "!";


  console.log("Move selected:", moveSelected);

  await sleep(3000);
  
  victoryPopup.classList.add("hidden");
  playScreen.classList.add("hidden");
  playArea.classList.remove("hidden");
  mainMenu.classList.remove("hidden");
  playerSelection.classList.add("hidden");
  enemySelection.classList.add("hidden");
  userBanner.classList.remove("hidden");

  if (winner === "win") {
    winner = 1;
  } else if (winner === "loss") {
    winner = 2;
  } else {
    winner = 3;
  }

  newMoney = data3.money + moneyChange;

  const postResults = await fetch('/api/postResults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result: winner, money: newMoney, opponent: data.user, p1select: moveSelected, p2select: data.selection, p2money: data.money })
  });

  loadProfile();
  
  playMenuMusic();

});

function determineMoneyChange(result, currentMoney, enemyMoney = 0) {
  if (result == "win") {
    money = 20;
  } else if (result == "loss") {
    money = -20;
  } else {
    money = 0;
  }
  return money;

}

function determineWinner(playerMove, enemyMove) {
  if (playerMove === enemyMove) {
    return "draw";
  } else if (
    (playerMove === 1 && enemyMove === 3) ||
    (playerMove === 2 && enemyMove === 1) ||
    (playerMove === 3 && enemyMove === 2)
  ) {
    return "win";
  } else {
    return "loss";
  }
}

function getProfilePicture(pfp) {
    if (!pfp) {
        return "static/images/pfps/1.png";
    } else {
        return "static/images/pfps/" + pfp + ".png";
    }
}
function getProfileBanner(banner) {
    if (!banner) {
        return "static/banners/1.png";
    } else {
        return "static/banners/" + banner + ".png";
    }
}

async function loadProfile(){ 
  const response = await fetch(`/api/playerInfo`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  userBanner.querySelector("h1").textContent = data.username;
  userBanner.querySelector("img").src = getProfilePicture(data.pfp);
  userBanner.style.backgroundImage = "url('" + getProfileBanner(data.banner) + "')";
  userBanner.querySelector("p").textContent = data.money + " dollars";
  
}