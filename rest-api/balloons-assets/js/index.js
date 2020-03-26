
let canvas = document.getElementById('balloons');
let ctx = canvas.getContext('2d');
let balloons = [];
let ballRadius = 20;

function drawBall(obj) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y , obj.radius, 0, Math.PI*2, false);
    ctx.fillStyle = `rgb(${obj.rgb.red}, ${obj.rgb.green}, ${obj.rgb.blue})`;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(obj.x + obj.direction.x*30, obj.y + obj.direction.y*30);
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.stroke();


    ctx.restore();
}


// balloons.push({
//     x: 400,
//     y: 300,
//     direction: {x: 1, y: 0,},
//     velocity: 0,
//     radius: 60,
//     rgb: randomColor(),
// });

function rotate(vector, angle){
    let tempX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
    let tempY = vector.y * Math.cos(angle) + vector.x * Math.sin(angle);
    vector.x = tempX;
    vector.y = tempY;
}

function getAngle(vector1, vector2) {
    return  Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x)
}

function checkCollision(index){
    let ball = balloons[index];
    for(let i = 0; i < balloons.length; i++){
        if(i !== index){
                let diameterVector = {
                    x: balloons[i].x - ball.x,
                    y: balloons[i].y - ball.y,
                };

                let combinedRadius = ball.radius + balloons[i].radius;

                let dist = Math.sqrt(Math.pow(diameterVector.x, 2) + Math.pow(diameterVector.y,2));
                if(dist <= combinedRadius) {
                    let angle1 = getAngle(diameterVector, ball.direction);
                    //let angle2 = getAngle(diameterVector, balloons[i].direction);

                    if (angle1 >= Math.PI / 2) {
                        angle1 -= Math.PI / 2;
                    }

                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    ctx.lineTo(ball.x - diameterVector.x * 10, ball.y - diameterVector.y * 10);
                    ctx.strokeStyle = 'rgb(0,255,0)';
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    ctx.lineTo(ball.x + diameterVector.x * 10, ball.y + diameterVector.y * 10);
                    ctx.strokeStyle = 'rgb(0,255,0)';
                    ctx.stroke();

                    let lastDirectionBall = ball.direction;
                    let lastDirectionBalloon = balloons[i].direction;
                    rotate(ball.direction, -angle1 * 2 - Math.PI);
                    //rotate(balloons[i].direction, -angle2 * 2 - Math.PI);

                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    ctx.lineTo(ball.x + ball.direction.x * 30, ball.y + ball.direction.y * 30);
                    ctx.strokeStyle = 'rgb(0,0,0)';
                    ctx.stroke();

                    if (lastDirectionBall.x * ball.direction.x + lastDirectionBall.y * ball.direction.y < 0) {
                        rotate(ball.direction, Math.PI)
                    }
                    if (lastDirectionBalloon.x * balloons[i].direction.x + lastDirectionBalloon.y * balloons[i].direction.y < 0) {
                        //rotate(balloons[i].direction, Math.PI)
                    }


                    //rotate(balloons[i].direction, Math.PI/2 + angle2);
                    ball.x += ball.direction.x * (Math.abs(dist - combinedRadius));
                    ball.y += ball.direction.y * (Math.abs(dist - combinedRadius));
                    ball.rgb = randomColor();


                    ctx.beginPath();
                    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
                    ctx.stroke();

                    debugger
            }
        }
    }
}


function draw(ball) {
    ball.x += ball.direction.x*ball.velocity;
    ball.y += ball.direction.y*ball.velocity;
    drawBall(ball);
    if (ball.x + ball.direction.x*ball.velocity > canvas.width - ball.radius || ball.x + ball.direction.x*ball.velocity < ball.radius) {
        ball.direction.x *= -1;
    }
    if (ball.y + ball.direction.y*ball.velocity > canvas.height - ball.radius || ball.y + ball.direction.y*ball.velocity < ball.radius) {
        ball.direction.y *= -1;
    }
    if (ball.x > canvas.width - ball.radius) {
        ball.x = canvas.width - ball.radius - 1;
    }else if(ball.x < ball.radius){
        ball.x = ball.radius + 1;
    }
    if (ball.y > canvas.height - ball.radius) {
        ball.y = canvas.height - ball.radius - 1;
    }else if(ball.y < ball.radius){
        ball.y = ball.radius + 1;
    }
}

function createBall() {
    //speed - 25
    let ball = {
        x: event.offsetX,
        y: event.offsetY,
        direction: {x: 1, y: 0,},
        velocity: 2,
        radius: ballRadius,
        collided: false,
        rgb: randomColor(),
    };
    rotate(ball.direction, Math.random()*2*Math.PI);
    balloons.push(ball);
    return ball;
}

function randomColor() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return {red, green, blue}
}


canvas.addEventListener('click',() => {
    drawBall(createBall())

});
if(balloons !== []){
    setInterval(function () {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        for(let i = 0; i < balloons.length; i++){
            draw(balloons[i]);
            //drawVector(balloons[i]);
            checkCollision(i);
        }
        for(let i = 0; i < balloons.length; i++){
            balloons[i].collided = false;
        }
    },16)
}

let reset = document.getElementById('reset'); //add event Listener
reset.addEventListener('click', resets);

function resets () {
    canvas = document.getElementById('balloons');
    ctx = canvas.getContext('2d');
    balloons = [];
}