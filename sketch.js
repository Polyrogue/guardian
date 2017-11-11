/*
 _____ _   _  ___  ____________ _____  ___   _   _ 
|  __ \ | | |/ _ \ | ___ \  _  \_   _|/ _ \ | \ | |
| |  \/ | | / /_\ \| |_/ / | | | | | / /_\ \|  \| |
| | __| | | |  _  ||    /| | | | | | |  _  || . ` |
| |_\ \ |_| | | | || |\ \| |/ / _| |_| | | || |\  |
 \____/\___/\_| |_/\_| \_|___/  \___/\_| |_/\_| \_/


Dependencies: p5.js, p5.dom.js, and p5.sound.js libraries.

Use the arrow keys to move. 
Press Z to fire.

The aim of the game is to progress as far as you can by killing the required number of aliens. Vulnerable colonists roam the surface of the planet that the alien landers try to kidnap.
If you shoot down any aliens trying to whisk an abducted colonist away, the colonist may be spared and float down to the surface. Rescuing them by collecting them (fly into them as they fall) will
grant you a score bonus and an extra life. If the colonist is successfully abducted it will be mutated and return as a flying monster that will chase the player.
*/

var inc = 0.005;
var start = 0;
var scrollSpd = 0.1
var player;
var vel = 0;

var bullets = [];
var colonists = [];
var landers = [];
var landerBullets = [];
var mutants = [];
var mutantBullets = [];
var explosions = [];
var stars = [];

var gameState = 0;
//  0 = menu 1 = game 2 = gameOver 3 = level complete

var moveUp = false;
var moveDown = false;
var moveLeft = false;
var moveRight = false;

var aliensLeft = 0;
var level = 1;
var lives = 3;
var score = 0;

function preload()
{
  try
	{
		gameFont = loadFont("assets/start.ttf");
	}
	catch(error)
	{
		gameFont = false;
	}
	sndShot = loadSound("assets/shot.wav");
	sndShot.setVolume(0.3);
	
	sndLanderK = loadSound("assets/landerKill.wav");
	sndLanderK.setVolume(0.3);
	
	sndDeath = loadSound("assets/death.wav");
	sndDeath.setVolume(0.3);
	
	sndStart = loadSound("assets/start.wav");
	sndStart.setVolume(0.3);
	
	sndStop = loadSound("assets/stop.wav");
	sndStop.setVolume(0.3);
	
	sndLanderS = loadSound("assets/landerShot.wav");
	sndLanderS.setVolume(0.3);
	
	sndMutantS = loadSound("assets/mutantShot.wav");
	sndMutantS.setVolume(0.3);
	
	sndSave = loadSound("assets/save.wav");
	sndSave.setVolume(0.3);
	
	sndComplete = loadSound("assets/complete.wav");
	sndComplete.setVolume(0.3);
	
	bgm = loadSound("assets/bgm.mp3");
	bgm.setVolume(0.3);
	
	cover = loadImage("assets/cover.png");
}


function setup() 
{
  frameRate(60);
  createCanvas(1000,800);
  pixelDensity(1);
  player = new Ship();
  GM = new GameManager();
  playText = "Press [ENTER] to play"
  readyToPlay = true
}

function draw() 
{
  switch(gameState)
  {
    case 0:
      GM.displayMenu();
      break;
    case 1:
      GM.updateGame();
      break;
    case 2:
      GM.displayGameOver();
      break;
    case 3:
      GM.displayLevelComplete();
  }
}



