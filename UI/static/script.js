const loginButton = document.querySelector(".login-btn");
const loginScreen = document.querySelector(".page-wrap");
const mainMenu = document.getElementById("mainMenu");
const blackMarketBtn = document.getElementById("blackMarketBtn");
const logoutBtn = document.getElementById("logoutBtn");

const historyBtn = document.getElementById("historyBtn");
const historyScreen = document.getElementById("historyScreen");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const mainMenuMarquee = document.getElementById("mainMenuMarquee");
const storeBtn = document.getElementById("storeBtn");

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

const store = document.getElementById("store");
const storeBackground = document.getElementById("storeBackground");
const backToMenuBtn2 = document.getElementById("backToMenuBtn2");

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

const storeMusic = new Audio("static/audio/storemusic.mp3");
storeMusic.volume = 0.05;

let musicStarted = false;
let currentMusic = bgMusic;

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

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
  storeMusic.pause();

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }

  currentMusic = bgMusic;
}

function playStoreMusic() {
  if (!musicStarted) return;

  bgMusic.pause();

  if (storeMusic.paused) {
    storeMusic.play().catch(() => {});
  }

  currentMusic = storeMusic;
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

// ── Screen transition helper ────────────────────────────────────────────
const overlay = document.getElementById("transitionOverlay");

async function transitionTo(show, hide = [], duration = 220) {
  // Fade out
  overlay.style.transition = `opacity ${duration}ms ease`;
  overlay.style.opacity = "1";
  await sleep(duration);

  // Swap screens
  hide.forEach(el => { if (el) el.classList.add("hidden"); });
  if (show) show.classList.remove("hidden");

  // Fade in
  overlay.style.opacity = "0";
  await sleep(duration);
}

// ── Result sound effects (Web Audio API — no extra files needed) ────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playWinSound() {
  const ctx = getAudioCtx();
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6 — major chord arpeggio
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.35);
  });
}

function playLossSound() {
  const ctx = getAudioCtx();
  const notes = [392, 349, 311, 262]; // G4 F4 Eb4 C4 — descending minor
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

function playDrawSound() {
  const ctx = getAudioCtx();
  // Two notes a semitone apart — unresolved tension
  [440, 466].forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}

let rememberUsernameOnLogout = false;



// ── Enter key triggers login ────────────────────────────────────────────
document.getElementById("username").addEventListener("keydown", function (e) {
  if (e.key === "Enter") loginButton.click();
});
document.getElementById("password").addEventListener("keydown", function (e) {
  if (e.key === "Enter") loginButton.click();
});

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
      userBanner.classList.remove("hidden");
      loadProfile();
      updateMarquee();
      bPresses = 0;
      blackMarketBtn.classList.add("hidden");
      await transitionTo(mainMenu, [loginScreen]);
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
    showToast("Please enter username and password", "error");
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
      showToast("Account created! Click 'Back to Login' to login.", "success");
    } else {
      showToast(data.error || "Signup failed", "error");
    }
  } catch (error) {
    showToast("Invalid Username or Password", "error");
  }
});

historyBtn.addEventListener("click", async function () {
  startMusic();
  await transitionTo(historyScreen, [mainMenu]);
  playMenuMusic();
  renderMatchHistory();
});

storeBtn.addEventListener("click", async function () {
  startMusic();
  storeBackground.classList.remove("hidden");
  switchStoreTab("shop");
  await storeOptions();
  await transitionTo(store, [mainMenu]);
  playStoreMusic();
});

const pfpAmount = 4;   // only 4 pfp images exist (1–4)
const bannerAmount = 1; // only 1 banner image exists

// ── Toast notification ──────────────────────────────────────────────────
let toastTimeout = null;
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  const toastIcon = document.getElementById("toastIcon");

  toastMsg.textContent = message;
  toastIcon.textContent = type === "error" ? "✗" : type === "info" ? "★" : "✓";
  toast.className = "toast " + type;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.classList.add("hidden"); }, 2800);
}


// ── Owned items (stored per-user in localStorage) ──────────────────────
function getOwnedKey(username) {
  return `rps_owned_${username}`;
}

function getOwnedItems(username) {
  try {
    const raw = localStorage.getItem(getOwnedKey(username));
    return raw ? JSON.parse(raw) : { pfps: [1], banners: [1] };
  } catch (e) { return { pfps: [1], banners: [1] }; }
}

function saveOwnedItems(username, owned) {
  localStorage.setItem(getOwnedKey(username), JSON.stringify(owned));
}

function addOwnedPfp(username, num) {
  const owned = getOwnedItems(username);
  if (!owned.pfps.includes(num)) owned.pfps.push(num);
  saveOwnedItems(username, owned);
}

function addOwnedBanner(username, num) {
  const owned = getOwnedItems(username);
  if (!owned.banners.includes(num)) owned.banners.push(num);
  saveOwnedItems(username, owned);
}

// ── Store tab switching ─────────────────────────────────────────────────
document.getElementById("tabShop").addEventListener("click", () => switchStoreTab("shop"));
document.getElementById("tabOwned").addEventListener("click", () => switchStoreTab("owned"));

function switchStoreTab(tab) {
  const panelShop  = document.getElementById("panelShop");
  const panelOwned = document.getElementById("panelOwned");
  const tabShop    = document.getElementById("tabShop");
  const tabOwned   = document.getElementById("tabOwned");

  if (tab === "shop") {
    panelShop.classList.remove("hidden");
    panelOwned.classList.add("hidden");
    tabShop.classList.add("active");
    tabOwned.classList.remove("active");
  } else {
    panelOwned.classList.remove("hidden");
    panelShop.classList.add("hidden");
    tabOwned.classList.add("active");
    tabShop.classList.remove("active");
  }
}

// ── Populate store ──────────────────────────────────────────────────────
async function storeOptions() {
  const res = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const playerData = await res.json();
  const equippedPfp    = playerData.pfp    || 1;
  const equippedBanner = playerData.banner || 1;
  const username       = playerData.username;

  // Ensure currently equipped items are always in owned list
  addOwnedPfp(username, equippedPfp);
  addOwnedBanner(username, equippedBanner);

  const owned = getOwnedItems(username);

  document.getElementById("pfpShopRow").innerHTML     = "";
  document.getElementById("bannerShopRow").innerHTML  = "";
  document.getElementById("pfpOwnedRow").innerHTML    = "";
  document.getElementById("bannerOwnedRow").innerHTML = "";

  // Shop: profile pictures
  for (let i = 1; i <= pfpAmount; i++) {
    const price   = Math.floor(randomMarketPrice() / 10);
    const isOwned = owned.pfps.includes(i);
    const shopCard = buildShopCard(
      `static/images/pfps/${i}.png`, `PFP ${i}`, price,
      isOwned ? "OWNED" : "BUY",
      isOwned,
      () => buyPfp(i, price, username)
    );
    document.getElementById("pfpShopRow").appendChild(shopCard);
  }

  // Shop: banners
  for (let i = 1; i <= bannerAmount; i++) {
    const price   = Math.floor(randomMarketPrice() / 10);
    const isOwned = owned.banners.includes(i);
    const shopCard = buildShopCard(
      `static/banners/${i}.png`, `Banner ${i}`, price,
      isOwned ? "OWNED" : "BUY",
      isOwned,
      () => buyBanner(i, price, username),
      true
    );
    document.getElementById("bannerShopRow").appendChild(shopCard);
  }

  // Collection: owned pfps
  for (const i of owned.pfps) {
    const isEquipped = (i === equippedPfp);
    const card = buildCollectionCard(
      `static/images/pfps/${i}.png`, `PFP ${i}`, isEquipped,
      () => equipPfp(i, username)
    );
    document.getElementById("pfpOwnedRow").appendChild(card);
  }

  // Collection: owned banners
  for (const i of owned.banners) {
    const isEquipped = (i === equippedBanner);
    const card = buildCollectionCard(
      `static/banners/${i}.png`, `Banner ${i}`, isEquipped,
      () => equipBanner(i, username),
      true
    );
    document.getElementById("bannerOwnedRow").appendChild(card);
  }

  switchStoreTab("shop");
  storeScrollEffect();
}

function buildShopCard(imgSrc, label, price, btnLabel, isOwned, onAction, isBanner = false) {
  const card = document.createElement("div");
  card.className = "store-card" + (isOwned ? " owned" : "");

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = label;
  img.className = isBanner ? "store-card-img banner-img" : "store-card-img";

  const priceEl = document.createElement("p");
  priceEl.className = "store-card-price";
  priceEl.textContent = isOwned ? "OWNED" : `$${price}`;

  const btn = document.createElement("button");
  btn.className = "store-buy-btn" + (isOwned ? " owned-btn" : "");
  btn.textContent = btnLabel;
  btn.disabled = isOwned;
  if (!isOwned) btn.addEventListener("click", onAction);

  card.appendChild(img);
  card.appendChild(priceEl);
  card.appendChild(btn);
  return card;
}

function buildCollectionCard(imgSrc, label, isEquipped, onEquip, isBanner = false) {
  const card = document.createElement("div");
  card.className = "store-card collection-card" + (isEquipped ? " equipped" : "");

  if (isEquipped) {
    const badge = document.createElement("div");
    badge.className = "equipped-badge";
    badge.textContent = "✓ EQUIPPED";
    card.appendChild(badge);
  }

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = label;
  img.className = isBanner ? "store-card-img banner-img" : "store-card-img";

  const labelEl = document.createElement("p");
  labelEl.className = "store-card-price";
  labelEl.textContent = label;

  const btn = document.createElement("button");
  btn.className = "store-buy-btn" + (isEquipped ? " equipped-btn" : "");
  btn.textContent = isEquipped ? "EQUIPPED" : "EQUIP";
  btn.disabled = isEquipped;
  if (!isEquipped) btn.addEventListener("click", onEquip);

  card.appendChild(img);
  card.appendChild(labelEl);
  card.appendChild(btn);
  return card;
}

async function buyPfp(num, price, username) {
  const res  = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  if (data.money >= price) {
    await fetch('/api/updateProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pfp: data.pfp, banner: data.banner, money: data.money - price })
    });
    addOwnedPfp(username, num);
    loadProfile();
    storeOptions();
    showToast(`PFP ${num} purchased! Find it in Your Collection.`, "success");
  } else {
    showToast("Not enough money!", "error");
  }
}

async function buyBanner(num, price, username) {
  const res  = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  if (data.money >= price) {
    await fetch('/api/updateProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pfp: data.pfp, banner: data.banner, money: data.money - price })
    });
    addOwnedBanner(username, num);
    loadProfile();
    storeOptions();
    showToast(`Banner ${num} purchased! Find it in Your Collection.`, "success");
  } else {
    showToast("Not enough money!", "error");
  }
}

async function equipPfp(num, username) {
  const res  = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  await fetch('/api/updateProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pfp: num, banner: data.banner, money: data.money })
  });
  loadProfile();
  storeOptions();
  showToast(`PFP ${num} equipped!`, "success");
}

async function equipBanner(num, username) {
  const res  = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  await fetch('/api/updateProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pfp: data.pfp, banner: num, money: data.money })
  });
  loadProfile();
  storeOptions();
  showToast(`Banner ${num} equipped!`, "success");
}

async function storeScrollEffect() {
  const pfpShopRow = document.getElementById("pfpShopRow");
  const cardWidth  = 145;
  const baseOffset = cardWidth * pfpAmount;
  pfpShopRow.style.transform = `translateX(0px)`;
  while (!store.classList.contains("hidden")) {
    const matrix = getComputedStyle(pfpShopRow).transform;
    const offset = matrix !== "none" ? (parseInt(matrix.split(",")[4]) || 0) : 0;
    if (offset <= -baseOffset) {
      pfpShopRow.style.transform = `translateX(${baseOffset}px)`;
    } else {
      pfpShopRow.style.transform = `translateX(${offset - 1.5}px)`;
    }
    await sleep(16);
  }
}



backToMenuBtn2.addEventListener("click", async function () {
  startMusic();
  await transitionTo(mainMenu, [store, storeBackground]);
  playMenuMusic();
});

backToMenuBtn.addEventListener("click", async function () {
  startMusic();
  await transitionTo(mainMenu, [historyScreen]);
  updateMarquee();
  playMenuMusic();
});

logoutBtn.addEventListener("click", async function () {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch (error) { }

  await transitionTo(loginScreen, [mainMenu, historyScreen, blackMarketScreen, store, storeBackground, playScreen, userBanner]);

  document.body.classList.remove("dark-mode");
  bPresses = 0;
  blackMarketBtn.classList.add("hidden");

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
    showToast(`${powerupType.charAt(0).toUpperCase() + powerupType.slice(1)} purchased! (${newPowerups} owned)`, "success");
  } else {
    showToast("Not enough money to purchase this power-up!", "error");
  }
}

async function updateBlackMarketPrices() {
  while (blackMarketScreen.classList.contains("hidden") === false) {
    replayPrice.textContent = "$" + randomMarketPrice();
    overwritePrice.textContent = "$" + randomMarketPrice();
    await sleep(500);
  }
}

blackMarketBtn.addEventListener("click", async function () {
  startMusic();
  document.body.classList.add("dark-mode");
  await transitionTo(blackMarketScreen, [mainMenu]);
  playBlackMarketMusic();
  updateBlackMarketPrices();
});

blackMarketBackBtn.addEventListener("click", async function () {
  document.body.classList.remove("dark-mode");
  await transitionTo(mainMenu, [blackMarketScreen]);
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
      bPresses = 0;
      blackMarketBtn.classList.add("hidden");
      loadProfile();
      updateMarquee();
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
  // First fetch wallet so we can cap the bet
  const infoRes = await fetch('/api/playerInfo', { headers: { 'Content-Type': 'application/json' } });
  const infoData = await infoRes.json();
  const walletAmount = infoData.money || 0;

  // Show bet popup
  document.getElementById("betWalletDisplay").textContent = "$" + walletAmount;
  const betInput = document.getElementById("betInput");
  betInput.value = "";
  betInput.max = walletAmount;

  document.getElementById("betMin").onclick = () => {
    betInput.value = Math.min(10, walletAmount);
  };
  document.getElementById("betHalf").onclick = () => {
    betInput.value = Math.max(1, Math.floor(walletAmount / 2));
  };
  document.getElementById("betAll").onclick = () => {
    betInput.value = walletAmount;
  };

  const betPopup = document.getElementById("betPopup");
  betPopup.classList.remove("hidden");
  mainMenu.classList.add("hidden");
  userBanner.classList.add("hidden");

  // Wait for confirm
  let betAmount = 0;
  await new Promise(resolve => {
    document.getElementById("betConfirmBtn").onclick = () => {
      const raw = parseInt(betInput.value);
      if (!raw || raw < 1) {
        betInput.style.borderColor = "#ff4444";
        betInput.placeholder = "Enter amount!";
        return;
      }
      betAmount = Math.min(raw, walletAmount);
      betPopup.classList.add("hidden");
      resolve();
    };
  });

  if (musicStarted) {
    bgMusic.pause();
  }

  matchmakingPopup.classList.remove("hidden");

  const randval = Math.random() * 500 + 100;

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
  console.log("Bet amount:", betAmount);

  const enemyBanner = document.getElementById("enemy-banner");
  const playerBanner = document.getElementById("player-banner");

  enemyBanner.querySelector("p").textContent = data.username;
  playerBanner.querySelector("p").textContent = data2.user.username;
  enemyBanner.querySelector("img").src = getProfilePicture(data.pfp);
  playerBanner.querySelector("img").src = getProfilePicture(data3.pfp);
  enemyBanner.style.backgroundImage = "url('" + getProfileBanner(data.banner) + "')";
  playerBanner.style.backgroundImage = "url('" + getProfileBanner(data3.banner) + "')";

  // Show bet amount on play screen
  const betDisplay = document.getElementById("betAmountDisplay");
  if (betDisplay) betDisplay.textContent = "BET: $" + betAmount;

  let moveSelected = null;

  rockBtn.disabled = false;
  paperBtn.disabled = false;
  scissorsBtn.disabled = false;

  rockBtn.addEventListener("click", function() { moveSelected = 1; });
  paperBtn.addEventListener("click", function() { moveSelected = 2; });
  scissorsBtn.addEventListener("click", function() { moveSelected = 3; });

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
    // Re-trigger pulse animation each tick
    countdownPopup.style.animation = "none";
    countdownPopup.offsetHeight; // reflow
    countdownPopup.style.animation = "";
    timer.textContent = count > 0 ? count : "GO!";
    if (count <= 0) {
      clearInterval(countdownInterval);
      setTimeout(() => countdownPopup.classList.add("hidden"), 400);
    }
  }, 500);

  await sleep(1500);

  const moveEmojis = { 1: "✊", 2: "✋", 3: "✌️" };
  const moveNames  = { 1: "ROCK", 2: "PAPER", 3: "SCISSORS" };

  playerSelection.querySelector("p").textContent = moveEmojis[moveSelected] || "?";
  enemySelection.querySelector("p").textContent  = moveEmojis[data.selection] || "?";

  const playerSelLabel = document.getElementById("playerSelLabel");
  const enemySelLabel  = document.getElementById("enemySelLabel");
  if (playerSelLabel) playerSelLabel.textContent = (moveNames[moveSelected] || "") + " — YOU";
  if (enemySelLabel)  enemySelLabel.textContent  = "ENEMY — " + (moveNames[data.selection] || "");

  playerSelection.classList.remove("hidden");
  await sleep(180);
  enemySelection.classList.remove("hidden");

  await sleep(600);

  let winner = determineWinner(moveSelected, data.selection);

  // Apply glow to winner card
  if (winner === "win") {
    playerSelection.style.boxShadow = "0 0 50px rgba(0,255,100,0.9)";
    enemySelection.style.opacity = "0.45";
  } else if (winner === "loss") {
    enemySelection.style.boxShadow = "0 0 50px rgba(0,100,255,0.9)";
    playerSelection.style.opacity = "0.45";
  }

  await sleep(500);

  // Apply powerup before showing popup
  console.log("powerups available:", data3.powerups);
  if (winner !== "win" && data3.powerups > 0) {
    const powerupsLeft = data3.powerups - 1;
    winner = "win";
    await fetch('/api/usePowerup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPowerups: powerupsLeft })
    });
  }

  const moneyChange = determineMoneyChange(winner, betAmount);

  // Play result sound
  if (winner === "win")       playWinSound();
  else if (winner === "loss") playLossSound();
  else                        playDrawSound();

  // Show victory popup with correct class
  victoryPopup.className = "victory-popup " + (
    winner === "win"  ? "win-popup"  :
    winner === "loss" ? "loss-popup" : "draw-popup"
  );
  const vDisplay = document.getElementById("vDisplay");
  vDisplay.textContent =
    winner === "win"  ? (data3.powerups > 0 ? "Cheated!" : "You win!") :
    winner === "loss" ? "You lose!" : "Draw!";

  document.getElementById("vMoney").textContent =
    moneyChange > 0  ? `+$${moneyChange}` :
    moneyChange < 0  ? `-$${Math.abs(moneyChange)}` : "No change";

  await sleep(3200);

  victoryPopup.className = "victory-popup hidden";
  playScreen.classList.add("hidden");
  playArea.classList.remove("hidden");
  playerSelection.classList.add("hidden");
  enemySelection.classList.add("hidden");
  playerSelection.style.boxShadow = "";
  playerSelection.style.opacity   = "";
  enemySelection.style.boxShadow  = "";
  enemySelection.style.opacity    = "";
  userBanner.classList.remove("hidden");
  await transitionTo(mainMenu, [playScreen]);

  const winnerCode = winner === "win" ? 1 : winner === "loss" ? 2 : 3;
  const newMoney = data3.money + moneyChange;

  await fetch('/api/postResults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result: winnerCode, money: newMoney, opponent: data.user, p1select: moveSelected, p2select: data.selection, p2money: data.money })
  });

  loadProfile();
  updateMarquee();
  playMenuMusic();
});

function determineMoneyChange(result, betAmount) {
  if (result === "win")  return betAmount;
  if (result === "loss") return -betAmount;
  return 0;
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

async function updateMarquee() {
  try {
    const response = await fetch('/api/matchHistory', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    const matches = data.matches;

    if (!matches || matches.length === 0) {
      mainMenuMarquee.querySelector("span").textContent =
        "NO MATCHES YET • PLAY YOUR FIRST DUEL • WIN BIG TONIGHT • ";
      return;
    }

    let wins = 0, losses = 0, draws = 0;
    const recentParts = [];

    matches.forEach(match => {
      let result, opp;
      if (match.p1id === data.userId) {
        if (match.victor === 1)      { result = "WIN";  wins++;   }
        else if (match.victor === 2) { result = "LOSS"; losses++; }
        else                         { result = "DRAW"; draws++;  }
        opp = match.otherName || "???";
      } else {
        if (match.victor === 2)      { result = "WIN";  wins++;   }
        else if (match.victor === 1) { result = "LOSS"; losses++; }
        else                         { result = "DRAW"; draws++;  }
        opp = match.playerName || "???";
      }
      recentParts.push(`${result} vs ${opp}`);
    });

    const total = wins + losses + draws;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    const recent = recentParts.slice(0, 5).join(" • ");

    mainMenuMarquee.querySelector("span").textContent =
      `RECORD: ${wins}W-${losses}L-${draws}D • WIN RATE: ${winRate}% • RECENT: ${recent} • `;
  } catch (e) {
    // silently fail
  }
}
