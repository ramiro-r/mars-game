/*
	"Marte" - Ramiro Rodriguez
*/

//#region ***** Global variables *****/
let customFont;
let levelTimeElapsed = 0;
let startTime = 0;

const KEY_CODES = {
	right: 39,
	left: 37,
	up: 87,
	spaceBar: 32
}

const sounds = {
	backgroundMusic: null,
	collectable: null,
	jetpack: null,
	meteor: null
};

const gameChar = {
	x: 0,
	y: 0,
	armsLength: 8,
	armsWidth: 20,
	movement: {
		right: false,
		left: false,
		jump: false,
		fall: false,
	},
	speed: 4,
	jumpHeight: 150,
	jumpSpeed: 2,
	gravity: 3,
	width: 58,
	initialPos: 150,
	move: function() {
		if (this.movement.inCanyon && this.y < height) {
			this.y += this.gravity;
		} else if (this.movement.inCanyon && this.y >= height) {
			if (!scene.isLosingLife) loseLife();
			return;
		}

		if (!this.movement.inCanyon) {
			/***** side movement *****/
			if(this.movement.right && this.x < scene.edgeRight - scene.edgePadding) {
				this.x += this.speed;
			} else if (this.movement.left && this.x > scene.edgeLeft + scene.edgePadding) {
				this.x -= this.speed;
			}
			
			/***** jump movement and fall *****/
			if (this.movement.jump && this.y >= backgroundLayer.floorPos_y - this.jumpHeight) {
				this.y -= this.jumpSpeed;
			} else if(!this.movement.jump && this.y < backgroundLayer.floorPos_y) {
				for (let i=0; i < backgroundLayer.platforms.list.length; i++) {
					if (backgroundLayer.platforms.list[i].isOnPlatform()) {
						this.movement.fall = false;
						break;
					} else {
						this.movement.fall = true;
					}
				}
				if (this.movement.fall) {
					this.y += this.gravity;
				}
			} else if (!this.movement.jump) {
				this.movement.fall = false;
			}
		}
	},
	draw: function() {
		push();
		noStroke();
		if(this.movement.left && this.movement.fall)
		{
			/***** jumping-left code *****/
			//tank
			fill(colours.character.tank)
			rect(this.x - 2, this.y - 48, 12, 36);
			// body
			fill(colours.character.body);
			triangle(this.x - 18, this.y - 32, this.x - 2, this.y - 38, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x - 14, this.y - 48, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x - 18, this.y - 48, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x - 24, this.y - 48, 4, 4);
			//arm left
			fill(colours.character.arms);
			push();
			translate(this.x - 10, this.y - 28);
			rotate(radians(210));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			ellipse(this.x - 8, this.y - 32, 10, 10);

			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		else if(this.movement.right && this.movement.fall)
		{
			/***** jumping-right code *****/
			//tank
			fill(colours.character.tank)
			rect(this.x - 10, this.y - 48, 12, 36);
			// body
			fill(colours.character.body);
			triangle(this.x + 18, this.y - 32, this.x + 2, this.y - 38, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x + 14, this.y - 48, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x + 18, this.y - 48, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x + 24, this.y - 48, 4, 4);
			//arm left
			fill(colours.character.arms);
			push();
			translate(this.x + 4, this.y - 30);
			rotate(radians(-40));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			ellipse(this.x + 8, this.y - 32, 10, 10);
			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		else if(this.movement.left)
		{
			/***** walking left code *****/
			//tank
			fill(colours.character.tank)
			rect(this.x - 2, this.y - 48, 12, 36);
			// body
			fill(colours.character.body);
			triangle(this.x - 18, this.y - 32, this.x - 2, this.y - 38, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x - 14, this.y - 48, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x - 18, this.y - 48, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x - 14, this.y - 48, 4, 4);
			//arm left
			fill(colours.character.arms);
			push();
			translate(this.x - 8, this.y - 38);
			rotate(radians(40));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			ellipse(this.x - 8, this.y - 32, 10, 10);
			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		else if(this.movement.right)
		{
			/***** walking right code *****/
			//tank
			fill(colours.character.tank);
			rect(this.x - 10, this.y - 48, 12, 36);
			// body
			fill(colours.character.body);
			triangle(this.x + 18, this.y - 32, this.x + 2, this.y - 38, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x + 14, this.y - 48, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x + 18, this.y - 48, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x + 14, this.y - 48, 4, 4);
			//arm left
			fill(colours.character.arms);
			push();
			translate(this.x + 12, this.y - 31);
			rotate(radians(140));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			ellipse(this.x + 8, this.y - 32, 10, 10);
			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		else if(this.movement.fall || this.movement.jump)
		{
			/***** jumping face forwards *****/
			//tank
			fill(colours.character.tank)
			rect(this.x - 17.5, this.y - 48, 35, 38);
			// body
			fill(colours.character.body);
			triangle(this.x - 14, this.y - 40, this.x + 14, this.y - 40, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x, this.y - 45, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x, this.y - 45, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x + 2, this.y - 48, 4,4);
			//arms
			fill(colours.character.arms);
			push();
			translate(this.x - 16, this.y - 28);
			rotate(radians(-140));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			push();
			translate(this.x + 30, this.y - 40);
			rotate(radians(140));
			rect(0, 0, this.armsWidth, this.armsLength);
			pop();
			ellipse(this.x - 13, this.y - 32, 10, 10);
			ellipse(this.x + 13, this.y - 32, 10, 10);
			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		else
		{
			/***** standing *****/
			//tank
			fill(colours.character.tank)
			rect(this.x - 17.5, this.y - 48, 35, 38);
			// body
			fill(colours.character.body);
			triangle(this.x - 14, this.y - 40, this.x + 14, this.y - 40, this.x, this.y - 6);
			// head
			fill(colours.character.head.main);
			ellipse(this.x, this.y - 45, 30, 30);
			fill(colours.character.head.visor);
			ellipse(this.x, this.y - 45, 20, 20);
			fill(colours.character.head.reflection);
			ellipse(this.x + 2, this.y - 43, 4,4);
			//arms
			fill(colours.character.arms)
			rect(this.x - 17, this.y - 32, 8, 18);
			rect(this.x + 9, this.y - 32, 8, 18);
			ellipse(this.x - 13, this.y - 32, 8, 10);
			ellipse(this.x + 13, this.y - 32, 8, 10);
			//feet
			rect(this.x - 5, this.y - 6, 10, 8);
		}
		pop();
	}
}

/***** structure of color values, to be filled on setup *****/ 
let colours = {
	mountain: {
		layer1: 0,
		layer2: 0,
		layer3: 0
	},
	cloud: 0,
	tree: { 
		branch: 0,
		leaf: 0
	},
	collectable: {
		bubble: 0,
		reflection: 0
	},
	floor: 0,
	sky: {
		fadeBegin: 0,
		fadeEnd: 0
	},
	character: {
		tank: 0,
		body: 0,
		arms: 0,
		head: {
			main: 0,
			visor: 0,
			reflection: 0
		},
	},
	spaceship: {
		base: 0,
		shadow1: 0,
		shadow2: 0,
		shadow3: 0,
		blue: 0,
		light: 0
	},
	ui: {
		oxigenIndicator: 0,
		text: 0
	},
	platform: 0,
}

const backgroundLayer = {
	floorPos_y: 0,
	floorHeight: 0,
	mountains: {
		list: [],
		layers: 3
	},
	platforms: {
		list: [],
		amount: 10
	},
	clouds: {
		list: [],
		amount: 15,
		partsAmount: 10,
	},
	canyons: {
		list: [],
		amount: 15,
		width: 100,
	},
	trees: {
		list: [],
		amount: 15,
	},
}

const flagPole = {
	isReached: false,
	x: 0,
	y: 0,
	offsetFromEdge: 150
}

/***** scene config *****/
const scene = {
	cameraPosX: 0,
	sceneLength: 6,
	edgeLeft: 0,
	edgeRight: 0,
	edgePadding: 32,
	levelTime: 22000,
	timeRemaining: 22000,
	isMenu: true,
	isGameOver: false,
	isLosingLife: false,
	isComplete: false,
	initialLifes: 3,
	lifes: 3,
	collectables: {
		list: [],
		positions: [[340, 400], [800, 300], [1466, 330], [1898, 310], [2700, 300], [3150, 400], [4000, 340], [5150, 350]],
		scoreAmount: 2000,
		timeAmount: 1000,
	},
	enemies: {
		list: [],
		amount: 10,
	},
	ui: {
		lifeCounterPos: {
			x: 50,
			y: 80
		},
		oxigenIndicatorPos: {
			x: 500,
			y: 35,
			width: 250
		},
		scoreIndicatorPos: {
			y: 40
		}
	},
	score: 0,
	bonuses: {
		time: 100,
		life: 500
	},
	reset: function() {
		if (this.lifes === 0) {
			this.lifes = this.initialLifes;
			this.score = 0;
		}
		initializeTimer();
		initializeCharacter();
		initializeCollectables();
		initiliazeEnemies();
		sounds.backgroundMusic.play();
		this.isLosingLife = false;
		this.isGameOver = false;
		this.isComplete = false;
		this.cameraPosX = 0;
	}
}
//#endregion

//#region ***** factory functions ***** /
function Platform(x, y, l) {
	this.x = x;
	this.y = y;
	this.platformWidth = l;
	this.platformHeight = 20;
	this.draw = function() {
		push();
		noStroke();
		fill(colours.platform);
		rect(this.x, this.y, this.platformWidth, this.platformHeight);
		pop();
	}
	this.isOnPlatform = function() {
		return gameChar.x > this.x && gameChar.x < (this.x + this.platformWidth) && gameChar.y > this.y && gameChar.y < (this.y + this.platformHeight)
	}
}

function Mountain(layer) {
	const step = 64;
	this.base = 300;
	this.scaleFactor = 1;
	this.points = [];
	this.color = 0;
	this.draw = function() {
		push();
		stroke(this.color);
		fill(this.color);
		for (let i = 0; i < this.points.length - 1; i++) {
			let p1 = this.points[i];
			let p2 = this.points[i + 1];
			let pBase1 = { x: p1.x, y: backgroundLayer.floorPos_y + 10 };
			let pBase2 = { x: p2.x, y: backgroundLayer.floorPos_y + 10 };
			triangle(p1.x, p1.y, p2.x, p2.y, pBase1.x, pBase1.y);
			triangle(p2.x, p2.y, pBase2.x, pBase2.y, pBase1.x, pBase1.y);
		}
		pop();
	}

	// set the mountain color depending on the 3 layers defined
	if (layer % 3 == 0) {
		this.color = colours.mountain.layer3;
	} else if (layer % 3 == 1) {
		this.color = colours.mountain.layer2;
	} else {
		this.color = colours.mountain.layer1;
	}

	for (let x = scene.edgeLeft; x < scene.edgeRight + step; x += step) {
		let y = this.base + (layer * 50) - random(step, 150) * this.scaleFactor * (1 - layer/4);
		this.points.push({ x, y });
	}
}

function Cloud() {
	const centerX = random(width * 0.2, scene.edgeRight);
	const centerY = random(height * 0.1, height * 0.3);
	this.x = centerX;
	this.y = centerY;
	this.parts = [];
	this.draw = function() {
		push();
		noStroke();
		colours.cloud.setAlpha(200);
		fill(colours.cloud);
		for (let j = 0; j < this.parts.length; j++) {
			let currentPart = this.parts[j];
			ellipse(currentPart.x, currentPart.y, currentPart.size, currentPart.size);
		}
		pop();
	}

	for (let i = 0; i < backgroundLayer.clouds.partsAmount; i++) {
		const cloudPart = {
			x: this.x + random(-40, 40), // controls spreading on x of each part
			y: this.y + random(-8, 8), // controls spreading on y of each part
			size: random(20, 60),
		}
		this.parts.push(cloudPart);
	}
}

function Canyon(x) {
	this.x = x;
	this.width = backgroundLayer.canyons.width;
	
	this.draw = function() {
		push();
		noStroke();
		fill(backgroundLayer.mountains.list[2].color);
		rect(this.x, height - backgroundLayer.floorHeight, this.width, backgroundLayer.floorHeight);
		pop();
	};

	this.isOnCanyon = function() {
		if (gameChar.x < this.x + this.width - gameChar.width / 2 && gameChar.x > this.x + gameChar.width / 2 && gameChar.y >= backgroundLayer.floorPos_y) {
			gameChar.movement.fall = true;
			gameChar.movement.inCanyon = true;
		}
	}
}

function Tree(x, y) {
	this.x = x;
	this.y = y;
	this.angle = -90;
	this.length = 45;
	this.branchesLength = 4;
	this.branches = [];

	this.draw = function() {
		push();
		strokeWeight(10);
		colours.tree.branch.setAlpha(255);
		stroke(colours.tree.branch);
		line(this.x, this.y, this.x, this.y - this.length);
		
		for (let b = 0; b < this.branches.length; b ++) {
			strokeWeight(8);
			colours.tree.branch.setAlpha(180);
			stroke(colours.tree.branch);
			const branch = this.branches[b];
			line(branch.x, branch.y, branch.x2, branch.y2);

			for (let l = 0; l < branch.leaves.length; l++) {
				const leaf = branch.leaves[l];
				noStroke();
				colours.tree.leaf.setAlpha(leaf.opacity);
				fill(colours.tree.leaf);
				ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
			}
		}
		pop();
	}

	// branches
	for (let b = 0; b < this.branchesLength; b++) {
		const evenBranch = b % 2 ? 1 : -1;
		const branch = {
			x: this.x,
			y: this.y - this.length,
			x2: this.x + cos(radians(this.angle + random(5, 60) * evenBranch)) * this.length,
			y2: this.y - this.length + sin(radians(this.angle + random(5, 60) * evenBranch)) * this.length * 0.7,
			leaves: [],
		}

		// branch leaves
		for (let l = 0; l < random(5, 10); l ++) {
			branch.leaves.push({
				x: branch.x2 + random(-10,10),
				y: branch.y2 + random(-10, 10),
				size: random(10,20), 
				opacity: random(100, 255)
			});
		}

		this.branches.push(branch)
	}
}

function Collectable(x, y) {
	this.x = x;
	this.y = y;
	this.currentY = y;
	this.size = { width: 20, height: 20 };
	this.isFound = false;
	this.direction = 1;
	this.acceleration = 0.15;
	this.bounceLimit = 10;

	this.checkCollision = function() {
		if (dist(gameChar.x, gameChar.y, this.x, this.y) < this.size.width) {
			this.isFound = true;
			increaseTimer();
			increaseScore();
			sounds.collectable.play();
		}
	}

	this.animate = function() {
		if (this.isFound) return
		if (this.currentY - this.y < this.bounceLimit && this.direction === 1) {
			this.currentY += this.acceleration;
		} else if (this.currentY - this.y > -this.bounceLimit) {
			this.direction = -1;
			this.currentY -= this.acceleration;
		} else if (this.direction === -1) {
			this.direction = 1;
		}
		this.draw();
	}

	this.draw = function() {
		if (!this.isFound) {
			push();
			noStroke();
			fill(colours.collectable.bubble);
			ellipse(this.x, this.currentY, this.size.width - 8, this.size.height - 8);
			colours.collectable.bubble.setAlpha(150);
			fill(colours.collectable.bubble);
			ellipse(this.x, this.currentY, this.size.width, this.size.height);
			fill(colours.collectable.reflection);
			ellipse(this.x + 3, this.currentY - 4, 5, 5);
			pop();
		}
	}
}

function Enemy(x, y, size) {
	this.x = x;
	this.currentX = x;
	this.y = y;
	this.size = size;
	this.isCollisioning = false;
	this.movementLimit = 20;
	this.acceleration = 0.5;
	this.direction = Math.random() < 0.5 ? -1 : 1;

	this.animate = function() {
		if (this.currentX - this.x < this.movementLimit && this.direction === 1) {
			this.currentX += this.acceleration;
		} else if (this.currentX - this.x > -this.movementLimit) {
			this.direction = -1;
			this.currentX -= this.acceleration;
		} else if (this.direction === -1) {
			this.direction = 1;
		}
		this.draw();
	}

	this.draw = function() {
		push();
		noStroke();

		for (let i = 0; i < 8; i++) {
			let alpha = map(i, 0, 10, 255, 50);
			fill(255, 100, 0, alpha);
			ellipse(this.currentX + i * random(-2, 2), this.y + random(-5, 5), this.size - i * 2);
		}
		
		fill(150, 20, 50);
		ellipse(this.currentX, this.y, this.size, this.size);
		pop();
	}

	this.checkCollision = function() {
		if (this.isCollisioning) return;
		if (dist(gameChar.x, gameChar.y, this.currentX, this.y) < this.size / 2) {
			this.isCollisioning = true;
			sounds.meteor.play();
			loseLife();
		}
	}
}
//#endregion

//#region ***** Setup and initialization functions *****/
function setupColors() {
	colours = {
		mountain: {
			layer1: color(200, 100, 50),
			layer2: color(180, 80, 40),
			layer3: color(150, 60, 30)
		},
		cloud: color(210, 100, 100),
		tree: { 
			branch: color(150, 160, 40),
			leaf: color(255, 100, 50)
		},
		collectable: {
			bubble: color(50, 150, 250),
			reflection: color(255, 255, 255)
		},
		character: {
			tank: color(100,100,100),
			body: color(218,218,218),
			arms: color(235,235,235),
			head: {
				main: color(238,238,238),
				visor: color(150,150,150),
				reflection: color(255,255,255)
			},
		},
		floor: color(100, 50, 20),
		sky: {
			fadeBegin: color(255, 150, 100),
			fadeEnd: color(255, 100, 50)
		},
		spaceship: {
			base: color(255, 255, 255),
			shadow1: color(230, 230, 230),
			shadow2: color(210, 210, 210),
			shadow3: color(100, 100, 100),
			blue: color(0, 40, 255),
			light: color(255, 232, 120)
		},
		ui: {
			text: color(230, 200, 50),
			oxigenIndicator: color(50,160, 250)
		},
		platform: color(100, 50, 20)
	}
}

function setupFloor() {
	backgroundLayer.floorHeight = Math.floor(height * 2/10);
	backgroundLayer.floorPos_y = height - backgroundLayer.floorHeight;
}

function setupScene() {
	scene.edgeLeft = 0;
	scene.edgeRight = width * scene.sceneLength;
}

function setupFlagpole(x, y) {
	flagPole.x = x;
	flagPole.y = y;
}

function initializePlatforms() {
	for(let i=0; i < backgroundLayer.platforms.amount; i++) {
		const platformXLimit = scene.edgeLeft + 500;
		const platformX = platformXLimit + i * 450;
		const platformY = Math.floor(random(backgroundLayer.floorPos_y - 50, gameChar.jumpHeight + 180));
		const platformWidth = Math.floor(random(100, 150));
		const platform = new Platform(platformX, platformY, platformWidth);
		backgroundLayer.platforms.list.push(platform);
	}
}

function initializeMountains() {
	for (let i = 0; i < backgroundLayer.mountains.layers; i++) {
		const mountain = new Mountain(i);
		backgroundLayer.mountains.list.push(mountain);
	}
}

function initializeClouds() {
	for (let i = 0; i < backgroundLayer.clouds.amount; i++) {
		const cloud = new Cloud();
		backgroundLayer.clouds.list.push(cloud);
	}
}

function initializeTrees() {
	for (let i = 0; i < backgroundLayer.trees.amount; i++) {
		const treeX = getPosOutsideCanyon(scene.edgeLeft + scene.edgePadding, flagPole.x - 200);
		const tree = new Tree(treeX, backgroundLayer.floorPos_y);
		backgroundLayer.trees.list.push(tree);
	}
}

function initializeCollectables() {
	scene.collectables.list = [];
	for(let i = 0; i < scene.collectables.positions.length; i++) {
		const collectable = new Collectable(scene.collectables.positions[i][0], scene.collectables.positions[i][1]);
		scene.collectables.list.push(collectable);
	}
}

function initializeCanyons() {
	for(let i = 0; i < backgroundLayer.canyons.amount; i++) {
		const canyonX = getPosOutsideCanyon(scene.edgeLeft + scene.edgePadding + gameChar.initialPos, flagPole.x - 200);
		const canyon = new Canyon(canyonX);
		backgroundLayer.canyons.list.push(canyon);
	}
}

function initializeCharacter() {
	gameChar.x = gameChar.initialPos;
	gameChar.y = backgroundLayer.floorPos_y;
	gameChar.movement = {
		right: false,
		left: false,
		jump: false,
		fall: false,
		inCanyon: false
	}
}

function initiliazeEnemies() {
	scene.enemies.list = [];
	for(let i=0; i < scene.enemies.amount; i++) {
		const enemyX = Math.floor(random(gameChar.initialPos * 2, flagPole.x - 400));
		const enemyY = Math.floor(random(gameChar.jumpHeight + 150, backgroundLayer.floorPos_y - 50));
		const enemySize = Math.floor(random(10, 25));
		const enemy = new Enemy(enemyX, enemyY, enemySize);
		scene.enemies.list.push(enemy);
	}
}

//#endregion

//#region ***** drawing functions ***** /
function drawFloor() {
	push();
	noStroke();
	fill(colours.floor);
	rect(scene.edgeLeft, backgroundLayer.floorPos_y, scene.edgeRight, backgroundLayer.floorHeight);
	pop();
}

function drawPlatforms() {
	for(let i=0;i < backgroundLayer.platforms.list.length; i++) {
		backgroundLayer.platforms.list[i].draw();
	}
}

function drawSky() {
	push();
	for (let y = 0; y < height - backgroundLayer.floorHeight; y+=14) {
		const inter = map(y, 0, height / 2, 0, 1);
		const c = lerpColor(color(colours.sky.fadeBegin), color(colours.sky.fadeEnd), inter);
		stroke(c);
		strokeWeight(15);
		line(scene.edgeLeft, y, width * scene.sceneLength, y);
	}
	pop();
}

function drawMountains() {
	for (let i = 0; i < backgroundLayer.mountains.list.length; i++) {
		backgroundLayer.mountains.list[i].draw();
	}
}

function drawClouds() {
	for(let i=0; i < backgroundLayer.clouds.list.length; i++) {
		backgroundLayer.clouds.list[i].draw();
	}
}

function drawCanyons() {
	for(let i = 0; i < backgroundLayer.canyons.list.length; i++) {
		backgroundLayer.canyons.list[i].isOnCanyon();
		backgroundLayer.canyons.list[i].draw();
	}
}

function drawTrees() {
	for (let i = 0; i < backgroundLayer.trees.list.length; i++) {
		backgroundLayer.trees.list[i].draw();
	}
}

function drawCollectables() {
	for(let i = 0; i < scene.collectables.list.length; i++) {
		const currentCollectable = scene.collectables.list[i];
		if (!currentCollectable.isFound) {
			currentCollectable.checkCollision();
			currentCollectable.animate();
		}
	}
}

function drawEnemies() {
	for(let i=0; i < scene.enemies.list.length; i++) {
		const currentEnemy = scene.enemies.list[i];
		currentEnemy.checkCollision();
		currentEnemy.animate();
	}
}
//#endregion


//#region ***** flagpole drawing functions ***** /
function drawFlagpole() {
	checkFlagpole(flagPole);
	drawSpaceShip(flagPole);
}

function drawSpaceShip(t_flagpole) {
	push();
  noStroke();

	// lower body
	fill(255);
	rect(t_flagpole.x - 45, t_flagpole.y - 66, 30, 40);
	fill(colours.spaceship.shadow1);
	rect(t_flagpole.x - 15, t_flagpole.y - 66, 30, 40);
	fill(colours.spaceship.shadow2);
	rect(t_flagpole.x + 15, t_flagpole.y - 66, 30, 40);
	fill(colours.spaceship.shadow3);
	textSize(10);
	text("HOME", t_flagpole.x + 23, t_flagpole.y - 29);
	rect(t_flagpole.x - 30, t_flagpole.y - 26, 60, 10);
	
	// lower base
	fill(colours.spaceship.blue);
	beginShape();
	vertex(t_flagpole.x - 15, t_flagpole.y - 16);
	vertex(t_flagpole.x - 20, t_flagpole.y - 4);
	vertex(t_flagpole.x + 20, t_flagpole.y - 4);
	vertex(t_flagpole.x + 15, t_flagpole.y - 16);
	endShape(CLOSE);

	// supports
	stroke(colours.spaceship.shadow1);
	strokeWeight(4);
	line(t_flagpole.x - 46, t_flagpole.y - 28, t_flagpole.x - 60, t_flagpole.y - 24);
	line(t_flagpole.x + 46, t_flagpole.y - 28, t_flagpole.x + 60, t_flagpole.y - 24);
	line(t_flagpole.x - 65, t_flagpole.y - 4, t_flagpole.x - 55, t_flagpole.y - 56);
	line(t_flagpole.x + 65, t_flagpole.y - 4, t_flagpole.x + 55, t_flagpole.y - 56);
	stroke(colours.spaceship.blue);
	line(t_flagpole.x - 55, t_flagpole.y - 56, t_flagpole.x - 45, t_flagpole.y - 64);
	line(t_flagpole.x + 55, t_flagpole.y - 56, t_flagpole.x + 45, t_flagpole.y - 64);

	noStroke();
	fill(colours.spaceship.shadow1);
	rect(t_flagpole.x - 75, t_flagpole.y - 4, 15, 5);
	rect(t_flagpole.x + 60, t_flagpole.y - 4, 15, 5);

	// cabin
	fill(colours.spaceship.shadow1);
	beginShape();
	vertex(t_flagpole.x - 35, t_flagpole.y - 66);
	vertex(t_flagpole.x - 35, t_flagpole.y - 96);
	vertex(t_flagpole.x - 30, t_flagpole.y - 116);
	vertex(t_flagpole.x + 30, t_flagpole.y - 116);
	vertex(t_flagpole.x + 35, t_flagpole.y - 96);
	vertex(t_flagpole.x + 35, t_flagpole.y - 66);
	endShape();

	stroke(colours.spaceship.shadow1);
	line(t_flagpole.x - 25, t_flagpole.y - 116, t_flagpole.x - 25, t_flagpole.y - 125);

	// door
	noStroke();
	if (t_flagpole.isReached) {
		fill(colours.spaceship.light);
		rect(t_flagpole.x - 15, t_flagpole.y - 106, 30, 35);
		fill(colours.spaceship.blue);
		ellipse(t_flagpole.x - 25, t_flagpole.y - 131, 15, 15);
	} else {
		fill(colours.spaceship.shadow3);
		rect(t_flagpole.x - 15, t_flagpole.y - 106, 30, 35);
		fill(colours.spaceship.shadow1);
		ellipse(t_flagpole.x + 5, t_flagpole.y - 89, 5, 5);
		ellipse(t_flagpole.x - 25, t_flagpole.y - 131, 15, 15);
	}

	pop();
}

function checkFlagpole(t_flagpole) {
	const d = dist(gameChar.x, gameChar.y, t_flagpole.x, t_flagpole.y);
	if (d <= 20) {
		t_flagpole.isReached = true;
		levelComplete();
	} else {
		t_flagpole.isReached = false;
	}
}
//#endregion

//#region ***** UI drawing functions ***** /
function cameraUpdate() {
	const newCameraPos = gameChar.x - width / 2;
	if (newCameraPos >= scene.edgeLeft && newCameraPos < (width * scene.sceneLength - width)) {
		scene.cameraPosX = newCameraPos;
	}
}

function drawUI() {
	drawLifesCounter();
	drawScoreIndicator();
	if(!scene.isLosingLife && !scene.isGameOver && !scene.isComplete) {
		drawOxigenIndicator(scene.cameraPosX + width / 2 - scene.ui.oxigenIndicatorPos.width / 2, scene.ui.oxigenIndicatorPos.y);
	}
}

function drawGameState() {
	if (scene.isLosingLife || scene.isGameOver) {
		drawGameOver(scene.lifes > 0);
		return;
	}

	if (scene.isComplete) {
		drawLevelComplete();
		return;
	}
}

function drawScoreIndicator() {
	push();
	fill(255);
	textSize(24);
	text(`Score: ${scene.score}`, scene.cameraPosX + width - 100, scene.ui.scoreIndicatorPos.y);
	pop();
}

function drawLifesCounter() {
	for(let i=0;i < scene.lifes; i++) {
		drawLife(scene.cameraPosX + scene.ui.lifeCounterPos.x + i * 40, scene.ui.lifeCounterPos.y);
	}
}

function drawLife(xPos, yPos) {
	push();
	noStroke();
	fill(colours.character.head.main);
	ellipse(xPos - 14, yPos - 48, 30, 30);
	fill(colours.character.head.visor);
	ellipse(xPos - 14, yPos - 48, 20, 20);
	fill(colours.character.head.reflection);
	ellipse(xPos - 10, yPos - 46, 4, 4);
	pop();
}

function drawOxigenIndicator(xPos, yPos) {
	// time elapsed in percentage
	const currentElapsedTime = (scene.timeRemaining - levelTimeElapsed) * 100 / scene.levelTime;
	const indicatorWidth = scene.ui.oxigenIndicatorPos.width * currentElapsedTime / 100;
	push();
	strokeWeight(16);
	stroke(colours.ui.oxigenIndicator);
	line(xPos, yPos, xPos + indicatorWidth, yPos);
	pop();
}

function drawLevelComplete() {
	const score = calculateScore();
	textSize(100);
	textAlign(CENTER);
	fill(colours.ui.text);
	text("You've reached home!", width / 2, 250);
	textSize(25);
	text("Press space bar to play again", width / 2, 300);
	text(`Time Bonus: ${score.timeBonus}`, width / 2, 340);
	text(`Life Bonus: ${score.lifeBonus}`, width / 2, 370);
	textSize(30)
	text(`Final Score: ${score.total}`, width / 2, 410);
	textSize(25)
	
}

function drawGameOver(isLosingLife) {
	const displayText = isLosingLife ? "CONTINUE?" : "GAME OVER";
	textSize(100);
	textAlign(CENTER);
	fill(colours.ui.text);
	text(displayText, width / 2, 260);
	textSize(30);
	text("Press space bar to try again", width / 2, 310);
	if (scene.isGameOver) {
		text(`Final score: ${scene.score}`, width / 2, 350);
	}
}

function drawMenu() {
	textSize(150);
	textAlign(CENTER);
	fill(colours.ui.text);
	text("MARTE", width / 2, 220);
	textSize(30);
	text("<- and -> to move, W jetpack", width / 2, 280);
	text("Press any key to start", width / 2, 320);
}
//#endregion

//#region ***** user interactions ***** /
function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.

	if (scene.isMenu) {
		startGame();
		return;
	}

	if (keyCode === KEY_CODES.spaceBar && (scene.isGameOver || scene.isLosingLife || scene.isComplete)) {
		scene.reset();
	}

	if (scene.isGameOver || scene.isLosingLife || scene.isComplete) return;

	if (keyCode === KEY_CODES.right) {
		gameChar.movement.right = true;
	} else if (keyCode === KEY_CODES.up) {
		sounds.jetpack.play();
		gameChar.movement.jump = true;
		gameChar.movement.fall = false;
	} else if(keyCode === KEY_CODES.left) {
		gameChar.movement.left = true
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	if (scene.isGameOver || scene.isLosingLife || scene.isComplete) return;

	if (keyCode === KEY_CODES.right) {
		gameChar.movement.right = false;
	} else if (keyCode === KEY_CODES.up) {
		sounds.jetpack.stop();
		gameChar.movement.jump = false;
		gameChar.movement.fall = true;
	} else if(keyCode === KEY_CODES.left) {
		gameChar.movement.left = false;
	}
}
//#endregion

//#region ***** timer and end game logic ***** /
function startGame() {
	scene.isMenu = false;
	sounds.backgroundMusic.play();
	initializeTimer();
}

function initializeTimer(newLevelTime) {
	startTime = Date.now();
	scene.timeRemaining = newLevelTime || scene.levelTime;
	gameOverTimer = setTimeout(handleTimeOut, scene.timeRemaining);
}

function handleTimeOut() {
	loseLife();
}

function stopTimer() {
	clearTimeout(gameOverTimer);
}

function increaseTimer() {
	stopTimer();
	initializeTimer(scene.timeRemaining - levelTimeElapsed + scene.collectables.timeAmount);
}

function increaseScore() {
	scene.score+=10;
}

function calculateScore() {
	const timeBonus = Math.floor(scene.timeRemaining / 100 * scene.bonuses.time);
	const lifeBonus = Math.floor(scene.lifes * scene.bonuses.life);
	return {
		timeBonus,
		lifeBonus,
		total: scene.score + timeBonus + lifeBonus
	}
}

function loseLife() {
	stopTimer();
	scene.lifes--;
	scene.isLosingLife = true;
	if (scene.lifes === 0) {
		scene.isGameOver = true;
	}
}

function levelComplete() {
	stopTimer();
	scene.isComplete = true;
}
//#endregion

//#region ***** helper functions ***** /
function getPosOutsideCanyon(fromX, toX) {
	let validX = 0;
	
	while(validX === 0) {
		const posX = Math.floor(random(fromX, toX));

		if (!backgroundLayer.canyons.list.some(c => posX > c.x - 100 && posX < c.x + backgroundLayer.canyons.width + 100)) {
			validX = posX;
		}
	}

	return validX;
}
//#endregion

//#region ***** p5.js functions ***** /
function preload() {
	soundFormats('mp3');
	customFont = loadFont('assets/fonts/SmoochSans-Regular.ttf');
	sounds.backgroundMusic = loadSound('assets/sounds/equatorial_complex.mp3');
	sounds.collectable = loadSound('assets/sounds/bubble.mp3');
	sounds.jetpack = loadSound('assets/sounds/thrusters_loopwav.mp3');
	sounds.meteor = loadSound('assets/sounds/meteor.mp3');
	sounds.backgroundMusic.setVolume(0.5);
}

function setup() {
	textFont(customFont);
	createCanvas(Math.min(window.innerWidth, 1024), Math.min(window.innerHeight, 576));

	setupColors();
	setupScene();

	//#region ***** scene background setup *****/
	setupFloor();
	setupFlagpole(scene.edgeRight - flagPole.offsetFromEdge, backgroundLayer.floorPos_y);
	initializePlatforms();
	initializeMountains();
	initializeClouds();
	initializeCanyons();
	initializeTrees();
	initiliazeEnemies();
	initializeCollectables();
	//#endregion

	/***** character setup *****/
	initializeCharacter();
}

function draw() {
	levelTimeElapsed = (Date.now() - startTime);
	cameraUpdate();
	
	push();
	translate(-scene.cameraPosX, 0);

	//#region /////////// DRAWING CODE //////////
		drawSky();
		drawMountains();
		drawClouds();
		drawTrees();
		drawFloor();
		drawPlatforms();
		drawCanyons();
		drawFlagpole();
		gameChar.draw();
		
		if (scene.isMenu) {
			drawMenu();
			return;
		}

		drawCollectables();
		drawEnemies();
		drawUI();
	//#endregion
	pop();
	
	drawGameState();
	if (scene.isComplete || scene.isGameOver || scene.isLosingLife) {
		sounds.jetpack.stop();
		sounds.backgroundMusic.stop();
		return;
	}

	gameChar.move();
}
//#endregion
