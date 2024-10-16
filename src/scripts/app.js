const gameContext = gameCanvas.getContext("2d");
const bgrContext = bgrCanvas.getContext("2d");

// global vars
const mobile = isTouchDevice();
const interactionDown = mobile ? "touchstart" : "mousedown";
const interactionUp = mobile ? "touchend" : "mouseup";
const interactionMove = mobile ? "touchmove" : "mousemove";
const interactionTap = mobile ? "touchstart" : "mousedown";
const rollOver = mobile ? 0 : "mouseover";
const rollOut = mobile ? 0 : "mouseout";
function isTouchDevice() {
	return navigator.userAgent.search('Mobile') > 0;
}

// toggle fullscreen mode
function toggleFullscreen(e) {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
}

// global sizes
let width;
let height;
let scale;
let portrait;// orientation
let screenOffsetX = 0;
let screenOffsetY = 0;
let displayStats = 1;

// game state, 0: menu, 1: in-game
let state = 0;

let tween = { scale: 0, transitionZ: 0, transitionX: 0, transitionY: 0 };

// ui stuff
let controls, infoTab, dialog, warning, battleScreen, titleText, titlePng;
let actButton, upButton, leftButton, rightButton, downButton;
let playButton, soundButton, fullscreenButton;
let closeButton, playerButton, shipButton, crewButton;
let installButton, installPrompt = null;

// save the install prompt event
window.addEventListener("beforeinstallprompt", (event) => {
	event.preventDefault();
	installPrompt = event;

	tryToShowInstallButton();
	resizeUI(1);
});

// prevent long tap on mobile
document.oncontextmenu = e => { e.preventDefault(); };


// Game initialization
function init() {

	// resizing
	window.addEventListener("resize", () => resizeUI());

	// keyboard
	document.addEventListener("keydown", onKeyDown);

	// board zooming
	mainDiv.onwheel = onBoardZoom;

	gameInit();
	createUI();
	tryToShowInstallButton();
	resizeUI(1);
}

function initSound() {
	if (!audioContext) {
		SoundFXstart();
	}
}

function toggleSound(e) {
	initSound();
	if (SoundFXvolume == 1) {
		SoundFXvolume = 0;
	} else {
		SoundFXvolume += SoundFXvolume || 0.25;
		SoundFXmute();
	}
	setupSoundButton();
}

function setupSoundButton() {
	soundButton.innerHTML = (
		!SoundFXvolume ? "&#215"
			: (
				SoundFXvolume == 1 ? "&#8901&#8901" :
				SoundFXvolume > 0.25 ? "&#8901" : ""
			) + "&#8901"
	) + "&#10919";
}

function setupUI() {
	width = window.innerWidth;
	height = window.innerHeight;
	scale = getScale();
}

function resizeUI(event) {
	setupUI();
	// Set HTML positionings
	mainDiv.style.width = uiDiv.style.width = width + 'px';
	mainDiv.style.height = uiDiv.style.height = height + 'px';
	if (gameCanvas.width != width || gameCanvas.height != height) {
		gameDirty = 2;// changing the canvas size automatically clears it so we make sure to redraw
		gameCanvas.width = bgrCanvas.width = width;
		gameCanvas.height = bgrCanvas.height = height;
	}
	if (width > height) {
		// Landscape
		portrait = false;
		gameContainer.style.width = gameContainer.style.height = uiDiv.style.height = height + "px";
		gameContainer.style.left = "50%";
		screenOffsetX = (width - height)/2;
		screenOffsetY = 0;
		gameContainer.style.marginLeft = - height / 2 + "px";
		gameContainer.style.marginTop = gameContainer.style.top = 0;
	} else {
		// Portrait
		portrait = true;
		gameContainer.style.width = gameContainer.style.height = uiDiv.style.width = width + "px";
		gameContainer.style.top = "50%";
		screenOffsetX = 0;
		screenOffsetY = (height - width)/2;
		gameContainer.style.marginTop = - width / 2 + "px";
		gameContainer.style.marginLeft = gameContainer.style.left = 0;
	}

	if (event-1) updateActionButton(event);
	if (event-1) updateInfoTab();

	// Resize the other Dialog Menu
	updateStyleUI(warning,
		(inWarning ? '' : 'display:none;') +
		`border:2vh solid #fff9;border-left:0;border-right:0;width:${
			portrait ? width*.92 : width/2
		}px;top:50%;left:50%;transform:translateY(-${
			!state ? portrait ? 88 : 80 : portrait ? inBattle ? 64 : 56 : inBattle ? 44 : 35
		}%) translateX(-${
			portrait || !state ? 50 : inBattle ? 47 : 44
		}%)`, 60, 40
	);

	// Resize the Dialog Menu
	updateStyleUI(dialog,
		(inWarning ? (inDialog ? 'opacity:.5;' : 'display:none;') : inDialog ? '' : 'display:none;') +
		`border:2vh solid #fff9;border-left:0;border-right:0;width:${
			portrait ? width*.92 : width/2
		}px;top:50%;left:50%;transform:translateY(-${
			!state ? portrait ? 88 : 80 : portrait ? inBattle ? 64 : 56 : inBattle ? 44 : 35
		}%) translateX(-${
			portrait || !state ? 50 : inBattle ? 47 : 44
		}%)`, 60, 40
	);

	// Resize the Battle screen Menu
	updateStyleUI(battleScreen,
		(inBattle ? inDialog ? 'opacity:.5;' : '' : 'display:none;') +
		`border:2vh solid #fff9;border-left:0;border-right:0;width:${
			portrait ? width*.92 : width/2
		}px;top:50%;left:50%;transform:translateY(-${
			portrait ? 64 : 44
		}%) translateX(-${
			portrait ? 50 : 47
		}%)`, 60, 60
	);

	// Resize in-game UI elements
	if (upButton) {
		updateStyleUI(controls, `display:${inBattle?"none":"block"};bottom:1vmin;width:${portrait?54:26}%`);
		updateStyleUI(actButton, `opacity:${paused||dungeonFighting||autoBattle?.5:1};bottom:${inBattle?5:3}vmin;right:${inBattle?5:3}vmin;width:auto;padding:0 3vmin 3vmin;min-width:14vmin;min-height:12vmin`, 160, -1);
		upButton.style.fontSize =
		downButton.style.fontSize =
		leftButton.style.fontSize =
		rightButton.style.fontSize = 112 * scale + 'px';
		if (gamePlayer.overlay) {
			offscreenBitmaps[gamePlayer.overlay-1].style =
				`margin:3vmin 0 1vmin;border:2vmin solid #0000;border-radius:2vmin;background:#2266;position:relative;width:16vmin`;
		}
	}

	gameContext.imageSmoothingEnabled = bgrContext.imageSmoothingEnabled = false;

	if (closeButton) {
		updateStyleUI(closeButton, `position:relative;float:right;margin:2vmin 2vmin 0 0;background:#faac`, 68, 72);
	}

	if (playerButton) {
		playerButton.innerHTML = addHealthbar(playerHealth, playerHealthMax, playerAttack, displayStats);
		shipButton.innerHTML = addHealthbar(shipHealth, shipHealthMax, shipAttack, displayStats);
		crewButton.innerHTML = addHealthbar(crewHealth, crewHealthMax, crewAttack, displayStats);
		playerBitmap = offscreenBitmapsFlipped[0];
		shipBitmap = offscreenBitmapsFlipped[4];
		crewBitmap = offscreenBitmaps[5];

		playerButton.prepend(playerBitmap);
		shipButton.prepend(shipBitmap);
		crewButton.prepend(crewBitmap);
		playerBitmap.style.width = shipBitmap.style.width = crewBitmap.style.width = `${inBattle?18:12}vmin`;

		event = inBattle
			? `padding:3vmin;position:absolute;margin:5vmin;border-radius:4vmin;`
			: `padding:2vmin;position:relative;float:left;margin:2vmin 0 0 2vmin;border-radius:2vmin`;

		let landBattle = inBattle && inBattle < 4 && onFoot;
		updateStyleUI(
			playerButton,
			event + (inBattle?portrait?`bottom:0;left:0`:`top:12%`:''),
			inBattle ? 18 : 14, inBattle ? 12 : 9
		);
		updateStyleUI(
			shipButton,
			event + (inBattle?portrait?'bottom:0;left:0;margin-left:5%':`top:30%`:''),
			inBattle ? 18 : 14, inBattle ? 12 : 9
		);
		updateStyleUI(
			crewButton,
			event + (inBattle?portrait?`bottom:0;left:0;margin-left:${playerButton.offsetWidth*1.32}px`:`top:50%`:''),
			inBattle ? 18 : 14, inBattle ? 12 : 9
		);
		shipButton.style.display = landBattle ? "none" : "block";
		playerButton.style.display = !landBattle && inBattle ? "none" : "block";
		crewButton.style.display = !landBattle && inBattle ? "none" : "block";
		
		shipButton.style.opacity = onFoot && battleIntro ? .5 : 1;
		playerButton.style.opacity = !onFoot && battleIntro ? .5 : 1;
		crewButton.style.opacity = !onFoot && battleIntro ? .5 : 1;
	}

	// Fullscreen button
	if (fullscreenButton) updateStyleUI(fullscreenButton, `position:relative;float:right;margin:2vmin 2vmin 0 0`, 72, 72);
	// Sound button
	updateStyleUI(soundButton, `position:relative;float:right;margin:2vmin 2vmin 0 0;`, 68, 72);
	updateStyleUI(infoTab,
		`padding:${state?`3vmin 2vmin;margin:${inBattle?"2vmin":'4vmin'}`:'2vmin;margin:2vmin'} 2vmin${playerButton?`;top:${
			inBattle ? 0 : playerButton.offsetHeight}px`:''
		}`, state ? 18 : 32, 1
	);

	// Install, Play and Title
	if (playButton) {
		if (installButton) updateStyleUI(installButton, `top:${portrait?82:84}%;left:50%;transform:translateX(-50%);width:${portrait?35:25}%`, portrait?80:65, portrait?112:90);
		updateStyleUI(playButton, `top:${(portrait?installButton?69:75:installButton?66:72)}%;left:50%;transform:translateX(-50%);width:${portrait?60:40}%;background:#4f8a`);
		//updateStyleUI(playButton, `position:relative;margin:auto;top:70%;width:${portrait?60:40}%;background:#4f8a`);
		titlePng.innerHTML = getIcon(80*getSize());
		updateStyleUI(titlePng, `top:${portrait?58:54}%;left:50%;transform:translateY(-50%) translateX(-50%) scale(${portrait?width/400:height/600})`);
		titleText.innerHTML = `<div style="filter:drop-shadow(.2em .1em 0 #1267);text-shadow:#f74 .1em .05em;margin-top:-${112*scale}px;margin-left:${235*scale
			}px;font-size:${45*scale}px;color:#ff9"><i>The</i></div><div style="filter:drop-shadow(.15em .1em 0 #1267);text-shadow:#f74 .07em .03em;margin-top:-${95*scale}px;margin-left:${325*scale
			}px;font-size:${95*scale}px;color:#ff9"><i><u>Isle&#10556&#8202Hop</u></i></div>${getSpan("O<b>dyssey</b>", "#efe", 0, "filter:drop-shadow(.1em .05em 0 #1267);text-shadow:#1bc .06em .03em")}`;
		updateStyleUI(titleText, `top:50%;left:50%;transform:translateY(-${portrait?340:260}%) translateX(-50%) scale(${getSize(500)})`, 220);
	}
}

function switchState() {
	inDialog = 0;
	gameDirty = 2;
	state ++;
	gameInit();
	createUI();
	tryToShowInstallButton();
	resizeUI(1);
}

function interactionStart(handler) {
	holding = true;
	handler();
	window.addEventListener(interactionUp, interactionEnd.bind(this));
}

function interactionEnd() {
	window.removeEventListener(interactionUp, interactionEnd.bind(this));
	holding = false;
}
