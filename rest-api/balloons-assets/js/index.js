let canvas = document.getElementById('balloons');
let ctx = canvas.getContext('2d');
let balloons = [];
let ballRadius = 10;

function drawBall(obj) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y , ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = `rgb(${obj.rgb.red}, ${obj.rgb.green}, ${obj.rgb.blue})`;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function draw(ball) {
    drawBall(ball);
    if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
        ball.dx *= -1;
    }
    if (ball.y + ball.dy > canvas.height - ballRadius || ball.y + ball.dy < ballRadius) {
        ball.dy *= -1;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function createBall() {
    //speed - 25
    let ball = {
        x: event.offsetX,
        y: event.offsetY,
        dx: Math.ceil(Math.random() * 100) / 4 * randomSign(), // or (/100 * 25)
        //dy: (25 - Math.abs(this.dx)) * randomSign(), имхо так не работает???
        rgb: randomColor(),
    };
    ball.dy = (25 - Math.abs(ball.dx)) * randomSign();
    balloons.push(ball);
    return ball;
}

function randomColor() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return {red, green, blue}
}

function randomSign() {
    let rn = Math.random();
    if(rn < 0.5) {
        return -1;
    } return 1;
}

canvas.addEventListener('click',() => {
    drawBall(createBall())

});
if(balloons !== []){
setInterval(function () {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < balloons.length; i++){
        draw(balloons[i])
    }
},50)
}