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
const BALL_SIZE_MAX = 18;
const BALL_SIZE_MIN = 6;
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
     constructor(x = 0, y = 0, r = 5, vx = 0.5, vy = 0.5, color = "#EF476F") {
          this.x = x;
          this.y = y;
          this.r = r;
          this.vx = vx;
          this.vy = vy;
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
          this.x += this.vx;
          this.y += this.vy;

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
               // velocities are exchanged if masses are equal accordingto principle of elastic collision

               // Swap velocities
               const tempVx = this.vx;
               const tempVy = this.vy;
               this.vx = ballArray[i].vx;
               this.vy = ballArray[i].vy;
               ballArray[i].vx = tempVx;
               ballArray[i].vy = tempVy;

               // prevents overlap
               const penetrationDepth =
                    (this.r + ballArray[i].r - distance) / 2; // length of overlapping of two balls
               const angle = Math.atan2(dy, dx); // angle between the line connecting the centres of two balls and positve x axis
               const moveX = penetrationDepth * Math.cos(angle); // consine gives x component
               const moveY = penetrationDepth * Math.sin(angle); // sine gives y component

               this.x += moveX;
               this.y += moveY;
               ballArray[i].x -= moveX;
               ballArray[i].y -= moveY;
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
