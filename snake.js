
const game = ()=> {
    
    const music = new Audio();
    music.src = "./audio/Snake Eater.mp3";
    const startBtn = document.getElementById('startBtn');
    const introScreen = document.querySelector('.intro');
    const gameScreen = document.querySelector('.gameplay');

    // lOAD IMAGES AND SOUNDS ONCE. NOT EACH TIME WE START NEW GAME
    // load the images. The background, and the food
    const ground = new Image();
    const foodImg = new Image();
    ground.src = "./img/ground.png";
    foodImg.src = "./img/food.png";
    // Load the audio files.
    const dead = new Audio();
    const eat = new Audio();
    const up = new Audio();
    const left = new Audio();
    const right = new Audio();
    const down = new Audio();
    dead.src = "./audio/oof.mp3";
    eat.src = "./audio/eat.mp3";
    up.src = "./audio/up.mp3";
    left.src = "./audio/left.mp3";
    right.src = "./audio/right.mp3";
    down.src = "./audio/down.mp3";

    // the render speed, the smaller the harder. Default 90 
    var DIFFICULTY = 90;

    // Each difficulty will have a high score
    var highScores = [

    ];


    startBtn.addEventListener('click', ()=>{
        let difficulty  = document.getElementById('difficulty').options.selectedIndex;
        if (difficulty===0) DIFFICULTY = 200;
        else if (difficulty===1) DIFFICULTY = 130;
        else if (difficulty===2) DIFFICULTY = 90;
        else if (difficulty===3) DIFFICULTY = 70;
        else if (difficulty===4) DIFFICULTY = 50;

        introScreen.classList.add('fadeOut');
        gameScreen.classList.add('fadeIn');
        music.play();

        startGame();
    });

    // EACH TIME WE CLICK THE START BUTTON, THIS IS CALLED!
    function startGame() {

        const cvs = document.getElementById("snake");
        const ctx = cvs.getContext("2d");
    
        // Every key on the keyboard has a specific code
        const KEY_LEFT = 37;
        const KEY_UP = 38;
        const KEY_RIGHT = 39;
        const KEY_DOWN = 40;
        // Our grid is 17 by 15. On our grid, each box is 32 pixels
        const GRID_X = 17;
        const GRID_Y = 15;
        const box = 32;
    
        // create the snake. Default the head.
        let snake = [];
        snake[0] = {
            x: 5 * box,
            y: 10 * box
        }
    
        // create the food. the position must be in b/w the borders of the grid
        let food = {
            x: 13 * box,
            y: 10 * box
        }
    
        let score = 0;  // Player score
        let d;  // Direction of the snake
    
        // snake cannot go in the opposite direction
        document.addEventListener("keydown", event=>{
            let key = event.keyCode;
            if (key === KEY_LEFT && d != "RIGHT") {
                d = "LEFT";
                left.play();
            }
            else if (key === KEY_UP && d != "DOWN") {
                d = "UP";
                up.play();
            }
            else if (key === KEY_RIGHT && d != "LEFT") {
                d = "RIGHT";
                right.play();
            }
            else if (key === KEY_DOWN && d != "UP") {
                d = "DOWN";
                down.play();
            }
        });
    
        // Checks if the head of the snake collides with any part of the snake array
        function collision (head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) {
                    return true;
                }
            }
            // None of the parts of the snake were the same x,y as head.
            return false;
        }
    
        // draw everything to the canvas
        function draw () {
            // Draw the ground
            ctx.drawImage(ground, 0, 0);
    
            // Draw the snake
            for (let i = 0; i < snake.length; i++) {
                // The head color snake[0], and tail color snake[everything but 0]
                ctx.fillStyle = (i == 0) ? "black" : "cyan";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
    
                ctx.strokeStyle = "blue";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
    
            // Draw the food
            ctx.drawImage(foodImg, food.x, food.y);
    
            // Old snake head position
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;
    
            // UPDATE SNAKE POSITION based on direction
            if (d === "LEFT") snakeX -= box;
            if (d === "UP") snakeY -= box;
            if (d === "RIGHT") snakeX += box;
            if (d === "DOWN") snakeY += box;
    
            // CHECK IF SNAKE ATE FOOD: snake head and food are at same x,y
            if (snakeX == food.x && snakeY == food.y) {
                score++;
                eat.play();
                // make new food
                food = {
                    x: Math.floor(Math.random()*GRID_X+1) * box,
                    y: Math.floor(Math.random()*GRID_Y+3) * box
                }
            }
            else {
                // remove the tail
                snake.pop();
            }
            
            // Compute the new head
            let newHead = {
                x: snakeX,
                y: snakeY
            }
    
            // CHECK IF GAME OVER: if snake hits the walls OR collision within the snake
            if (snakeX < box || snakeX > GRID_X*box 
                || snakeY < 3*box || snakeY > (GRID_Y+2)*box
                || collision(newHead, snake)) {
                    dead.play();
                    clearInterval(game);
                    introScreen.classList.remove('fadeOut');
                    introScreen.classList.add('fadeIn');
                    gameScreen.classList.remove('fadeIn');
                    gameScreen.classList.add('fadeOut');
            }
                
            // adds newHead to the BEGINNING of the array
            snake.unshift(newHead);
            
            // The score
            ctx.fillStyle = "white";
            ctx.font = "45px sans-serif";
            ctx.fillText(score, 2.3*box, 1.6*box);
        }
    
        // call draw function every 100 ms. The more it redraws, the faster snake goes (HARD).
        let game = setInterval(draw, DIFFICULTY);
    }    
};

// Start the game
game();