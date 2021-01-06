var snake;
var food;
var gridScale = 25;
var framesPerSecond = 8;
var foodSpinAngle = 60;
var borderRectWidth = gridScale * 2

function setup() {
    createCanvas(500, 500);
    frameRate(framesPerSecond);
    food = new Food();
    snake = new Snake(food);
}

// function keyPressed() {
//     if (keyCode === LEFT_ARROW && snake.xSpeed <= 0 && snake.tail[0].x >= snake.x) {
//         snake.dir(-1, 0);
//     }
//     else if (keyCode === RIGHT_ARROW && snake.xSpeed >= 0 && snake.tail[0].x <= snake.x) {
//         snake.dir(1, 0);
//     }
//     else if (keyCode === DOWN_ARROW && snake.ySpeed >= 0 && snake.tail[0].y <= snake.y) {
//         snake.dir(0, 1);
//     }
//     else if (keyCode === UP_ARROW && snake.ySpeed <= 0 && snake.tail[0].y >= snake.y) {
//         snake.dir(0, -1);
//     }
// }

function detectMouse() {
    fill('red');

    if (mouseX > 0 && mouseX <= borderRectWidth * 2 && snake.xSpeed <= 0 && snake.tail[0] && snake.tail[0].x >= snake.x) {
        rect(0, 0, borderRectWidth, height);
        snake.dir(-1, 0);
    }
    else if (mouseX >= width - borderRectWidth*2 && mouseX < width && snake.xSpeed >= 0 && snake.tail[0] && snake.tail[0].x <= snake.x) {
        rect(width - borderRectWidth, 0, borderRectWidth, height);
        snake.dir(1, 0);
    }
    else if (mouseY >= height - borderRectWidth*2 && mouseY < height && snake.ySpeed >= 0 && snake.tail[0] && snake.tail[0].y <= snake.y) {
        rect(0, height - borderRectWidth, width, borderRectWidth);
        snake.dir(0, 1);
    }
    else if (mouseY > 0 && mouseY < borderRectWidth*2 && snake.ySpeed <= 0 && snake.tail[0] && snake.tail[0].y >= snake.y) {
        rect(0, 0, width, borderRectWidth);
        snake.dir(0, -1);
    }
}

function draw() {
    background(51);
    fill('grey');

    noFill();
    square(borderRectWidth*2,borderRectWidth*2,borderRectWidth*6)
    detectMouse();

    snake.update();
    snake.show();
    food.spin();
    food.show();
    snake.eat();
}

function Food() {
    this.x = 0;
    this.y = 0;
    this.rotation = 0;

    this.updateLocation = function () {
        this.x = Math.floor(Math.floor(Math.random() * width) / gridScale) * gridScale;
        this.y = Math.floor(Math.floor(Math.random() * height) / gridScale) * gridScale;
    }

    this.spin = function() {
        this.rotation = this.rotation + foodSpinAngle;
    }

    this.show = function () {
        fill('green');
        translate(this.x + gridScale / 2, this.y + gridScale/2);
        rotate(this.rotation);
        rect(-gridScale/2, -gridScale/2, gridScale, gridScale);
    }

    this.updateLocation();
}

function Snake(food) {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 1;
    this.ySpeed = 0;
    this.tail = [];
    this.tailColors = []
    this.tailLength = 0;
    this.snakeColor = 'blue';

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
        this.snakeColor = 'blue';
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
        this.showSnakeHead(this.x, this.y, gridScale, this.snakeColor);
        for (let i = 0; i < this.tailLength; i++) {
            let sq = this.tail[i];
            let color = this.tailColors[i]
            this.showSnakeCell(sq.x + gridScale / 2, sq.y + gridScale / 2, gridScale, color);
        }
    };

    this.showSnakeHead = function (x, y, size, color) {
        push();
        fill(color);
        if (color === 'red') {
            circle(x + gridScale / 2, y + gridScale / 2, size * 1.5);
        } else {
            circle(x + gridScale / 2, y + gridScale / 2, size / 1.5);
        }
        if (this.xSpeed !== 0) {
            line(x, y + gridScale / 2, x + gridScale, y + gridScale / 2, size, size);
        } else {
            line(x + gridScale / 2, y, x + gridScale / 2, y + gridScale, size, size);
        }
        pop();
    }

    this.showSnakeCell = function (x, y, size, color) {
        push();
        fill(color.red, color.green, color.blue);
        circle(x, y, size);
        pop();
    }

    this.eat = function () {
        if (this.x === food.x && this.y === food.y) {
            this.tailLength = this.tailLength + 1;
            this.tailColors.push({ red: Math.random() * 250, blue: Math.random() * 250, green: Math.random() * 250 })
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
