function getRandomInt(min, max) {
     const minCeiled = Math.ceil(min);
     const maxFloored = Math.floor(max);
     return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max, positive = true) {
     if (positive) {
          return Math.random() * (max - min) + min;
     } else {
          if (Math.random() > 0.5) {
               return (Math.random() * (max - min) + min) * -1; // negative number
          } else {
               return Math.random() * (max - min) + min; // positive number
          }
     }
}

const BOUNDARY_X_MIN = 10;
const BOUNDARY_X_MAX = 950; // 100px less than container's width
const BOUNDARY_Y_MIN = 10;
const BOUNDARY_Y_MAX = 500; // 100px less than container's height
const BALL_SIZE_MAX = 20;
const BALL_SIZE_MIN = 5;
const MAX_SPEED = 1;
const MIN_SPEED = 0.3;
const colors = [
     "#EF476F",
     "#FFD166",
     "#06D6A0",
     "#118AB2",
     "#ffafcc",
     "#edf2fb",
];

const BALL_COUNT = 500;
const container = document.getElementById("container");
const ballArray = [];

class Ball {
     constructor(
          x = 0,
          y = 0,
          r = 5,
          vx = 0.5,
          vy = 0.5,
          color = "#EF476F",
          dx = 1,
          dy = 1
     ) {
          this.x = x;
          this.y = y;
          this.r = r;
          this.vx = vx;
          this.vy = vy;
          this.dx = dx;
          this.dy = dy;
          this.color = color;

          this.w = this.r * 2;
          this.h = this.r * 2;

          this.element = document.createElement("div");
          this.element.style.width = `${this.w}px`;
          this.element.style.height = `${this.h}px`;
          this.element.style.top = `${this.y}px`;
          this.element.style.left = `${this.x}px`;
          this.element.style.position = `absolute`;
          this.element.style.background = this.color;
          this.element.style.borderRadius = "50%";
     }
     updatePosition(index) {
          this.element.style.top = `${this.y - this.r}px`; //  so that x,y will be the centre of ball
          this.element.style.left = `${this.x - this.r}px`; // so that x, y will be the centre of ball

          // Update ball's position
          this.x += this.dx * this.vx;
          this.y += this.dy * this.vy;

          this.handleBoxCollision();
          // comparing with all other balls for collision
          for (let i = 0; i < ballArray.length; i++) {
               if (i === index) {
                    //same ball
                    continue;
               }
               this.handleBallCollision(i);
          }
     }
     handleBoxCollision() {
          // left and right wall collision detection
          if (this.x + this.r >= 1000 || this.x - this.r <= 0) {
               this.vx = -this.vx;
          }

          //top and bottom wall collission detection
          if (this.y + this.r >= 600 || this.y - this.r <= 0) {
               this.vy = -this.vy;
          }
     }
     handleBallCollision(i) {
          const dx = this.x - ballArray[i].x;
          const dy = this.y - ballArray[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          // collision
          if (distance < this.r + ballArray[i].r) {
               console.log("collision");
               this.vx = -this.vx;
               this.vy = -this.vy;

               // prevents overlap
               const penetrationDepth = this.r + ballArray[i].r - distance;
               this.x += this.vx * penetrationDepth;
               this.y += this.vy * penetrationDepth;
               ballArray[i].x -= ballArray[i].vx * penetrationDepth;
               ballArray[i].y -= ballArray[i].vy * penetrationDepth;
          }
     }
}

function initializeBalls() {
     for (let i = 0; i < BALL_COUNT; i++) {
          const ball = new Ball(
               getRandomInt(BOUNDARY_X_MIN, BOUNDARY_X_MAX),
               getRandomInt(BOUNDARY_Y_MIN, BOUNDARY_Y_MAX),
               getRandomInt(BALL_SIZE_MIN / 2, BALL_SIZE_MAX / 2), //radius
               getRandomArbitrary(MIN_SPEED, MAX_SPEED, false),
               getRandomArbitrary(MIN_SPEED, MAX_SPEED, false),
               colors[getRandomInt(0, colors.length)]
          );
          ballArray.push(ball);
          container.appendChild(ball.element);
          console.log(ball);
     }
}

function animate() {
     for (let i = 0; i < ballArray.length; i++) {
          ballArray[i].updatePosition(i);
     }
     requestAnimationFrame(animate);
}

initializeBalls();
animate();
