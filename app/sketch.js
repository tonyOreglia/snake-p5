var snake;
var food;
var gridScale = 30;

function setup() {
    createCanvas(600, 600);
    frameRate(8);
    food = new Food();
    snake = new Snake(food);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW && snake.xSpeed <= 0 && snake.tail[0].x >= snake.x) {
        snake.dir(-1, 0);
    }
    else if (keyCode === RIGHT_ARROW && snake.xSpeed >= 0 && snake.tail[0].x <= snake.x) {
        snake.dir(1, 0);
    }
    else if (keyCode === DOWN_ARROW && snake.ySpeed >= 0 && snake.tail[0].y <= snake.y) {
        snake.dir(0, 1);
    }
    else if (keyCode === UP_ARROW && snake.ySpeed <= 0 && snake.tail[0].y >= snake.y) {
        snake.dir(0, -1);
    }
}

function draw() {
    background(51);
    if (mouseIsPressed) {
        snake.tailLength = snake.tailLength + 1;
    }
    snake.update();
    snake.show();
    food.show();
    snake.eat();
}

function Food() {
    this.x = 0;
    this.y = 0;

    this.updateLocation = function () {
        this.x = Math.floor(Math.floor(Math.random() * width) / gridScale) * gridScale;
        this.y = Math.floor(Math.floor(Math.random() * height) / gridScale) * gridScale;
    }

    this.show = function () {
        fill('green');
        rect(this.x, this.y, gridScale, gridScale);
        // circle(this.x + gridScale / 2, this.y + gridScale / 2, gridScale);
    }
    this.updateLocation();
}

function Snake(food) {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 1;
    this.ySpeed = 0;
    this.tail = [];
    this.tailLength = 0;
    this.snakeColor = 'white';

    this.dir = function(x, y) {
        this.xSpeed = x;
        this.ySpeed = y;
    }

    this.update = function() {
        if (this.hittingWall()) {
            this.snakeColor = 'red';
            redraw();
            noLoop();
            return;
        }
        this.snakeColor = 'white';
        if (this.hittingSelf()) {
            this.snakeColor = 'red';
            return;
        }
        for (let i = this.tailLength; i >= 0; i--) {
            this.tail[i + 1] = this.tail[i]
        }
        this.tail[0] = { x: this.x, y: this.y };
        this.x = this.x + this.xSpeed * gridScale;
        this.y = this.y + this.ySpeed * gridScale;
        this.x = constrain(this.x, 0, width - gridScale);
        this.y = constrain(this.y, 0, height - gridScale);
    }

    this.hittingWall = function () {
        return ((this.x === 0 && this.xSpeed < 0) || 
        (this.y === 0 && this.ySpeed < 0) || 
        (this.x === width - gridScale && this.xSpeed > 0) || 
        (this.y === height - gridScale && this.ySpeed > 0)) 
    }

    this.hittingSelf = function () {
        for (let i = 0; i < this.tailLength; i++) {
            sq = this.tail[i];
            if (this.x === sq.x && this.y === sq.y) {
                return true;
            }
        }
        return false;
    }
    
    this.show = function () {
        fill(this.snakeColor);
        rect(this.x, this.y, gridScale, gridScale);
        // circle(this.x + gridScale / 2, this.y + gridScale / 2, gridScale);
        for (let i = 0; i < this.tailLength; i++) {
            let sq = this.tail[i];
            rect(sq.x, sq.y, gridScale, gridScale);
            // circle(sq.x + gridScale / 2, sq.y + gridScale / 2, gridScale);
        }
    };

    this.eat = function () {
        if (this.x === food.x && this.y === food.y) {
            this.tailLength = this.tailLength + 1;
            food.updateLocation();
            for (let i = 0; i < this.tailLength; i++) {
                sq = this.tail[i];
                while ((food.x === sq.x && food.y === sq.y ) || (food.x === this.x && food.y === this.y)) {
                    food.updateLocation();
                }
            }
        }
    }
}
