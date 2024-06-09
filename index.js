// min inclusive
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

const BOUNDARY_X_MIN = 0;
const BOUNDARY_X_MAX = 1000;
const BOUNDARY_Y_MIN = 0;
const BOUNDARY_Y_MAX = 600;
const BALL_SIZE_MAX = 18;
const BALL_SIZE_MIN = 6;
const MAX_SPEED = 1.2;
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
     constructor(x, y, r, vx, vy, color) {
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
          // right wall collision
          if (this.x + this.r > BOUNDARY_X_MAX) {
               this.vx = -this.vx;
               this.x = BOUNDARY_X_MAX - this.r; // to prevent ball from getting stuck in the boundary
          }
          // left wall collision
          if (this.x - this.r < BOUNDARY_X_MIN) {
               this.vx = -this.vx;
               this.x = this.r; // to prevent ball from getting stuck in the boundary
          }
          //bottom wall collision
          if (this.y + this.r > BOUNDARY_Y_MAX) {
               this.vy = -this.vy;
               this.y = BOUNDARY_Y_MAX - this.r;
          }
          // top wall collision
          if (this.y - this.r < BOUNDARY_Y_MIN) {
               this.vy = -this.vy;
               this.y = this.r;
          }
     }
     handleBallCollision(i) {
          const dx = this.x - ballArray[i].x;
          const dy = this.y - ballArray[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

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

               this.x += moveX; // moving the overlapping balls in opposite direction
               this.y += moveY;
               ballArray[i].x -= moveX;
               ballArray[i].y -= moveY;
          }
     }
}

function initializeBalls() {
     for (let i = 0; i < BALL_COUNT; i++) {
          const ball = new Ball(
               getRandomArbitrary(BOUNDARY_X_MIN, BOUNDARY_X_MAX),
               getRandomArbitrary(BOUNDARY_Y_MIN, BOUNDARY_Y_MAX),
               getRandomArbitrary(BALL_SIZE_MIN / 2, BALL_SIZE_MAX / 2), //radius
               getRandomArbitrary(MIN_SPEED, MAX_SPEED, false), // speed can have positive or negative value
               getRandomArbitrary(MIN_SPEED, MAX_SPEED, false), // speed can have positive or negative value
               colors[Math.floor(getRandomArbitrary(0, colors.length))] // color index has to be an integer
          );
          ballArray.push(ball);
          container.appendChild(ball.element);
     }
     console.log(ballArray);
}

function animate() {
     for (let i = 0; i < ballArray.length; i++) {
          ballArray[i].updatePosition(i);
     }
     requestAnimationFrame(animate);
}

initializeBalls();
animate();
