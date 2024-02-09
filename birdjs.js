//board
let board;
let boardWidth = 1364;
let boardHeight = 650;
let context;

//bird
let birdWidth = 50; //width/height ratio = 408/228 = 17/12
let birdHeight = 50;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let plyButton;
let restartButton;

window.onload = function() {
		intialVar();				
		plyButton = document.querySelector('.playbtn');
		restartButton = document.querySelector('.stopbtn');
		startClick();
		restartClick();
}

function intialVar() {
	board = document.getElementById("board");
		board.height = boardHeight;
		board.width = boardWidth;
		context = board.getContext("2d"); //used for drawing on the board

		//draw flappy bird
		// context.fillStyle = "green";
		// context.fillRect(bird.x, bird.y, bird.width, bird.height);

		//load images
		birdImg = new Image();
		birdImg.src = "./v.png";
		birdImg.onload = function() {
		   // context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
			context.drawImage(birdImg,30,300,100,100);

		}

		topPipeImg = new Image();
		topPipeImg.src = "./ii.png";

		bottomPipeImg = new Image();
		bottomPipeImg.src = "./i.png";	
}

function startClick() {
	plyButton.addEventListener('click',function (){
	
	startButton.style.display = "none";
    requestAnimationFrame(update);
	
	
    setInterval(placePipes, 2000); //every 1.5 seconds
	
    document.addEventListener("keydown", moveBird);
	});
}

function restartClick() {
	restartButton.addEventListener('click',function (){
		location.reload();
	});
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
		document.removeEventListener("keydown", moveBird);
		restartButton.style.display = "block";
		}
    }

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;


        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
			
			
       }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
 
