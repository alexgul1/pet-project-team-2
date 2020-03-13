let canvas = document.getElementById('balloons');
let ctx = canvas.getContext('2d');
let balloons = [];
let ballRadius = 20;
let speed = 1;

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

function collide(index) {
    let ball = balloons[index];
    for(let i = 0; i < balloons.length; i++){
        if(i !== index){
            let dist = Math.sqrt(Math.pow(balloons[i].x - ball.x, 2) + Math.pow(balloons[i].y - ball.y,2));
            if(dist <= ballRadius*2){
                if(ball.y < balloons[i].y){
                    ball.dy *= -1;
                    balloons[i].dy *= -1;
                }
                if(ball.x < balloons[i].x){
                    ball.dx *= -1;
                    balloons[i].dx *= -1;
                }
                ball.rgb = randomColor();
                balloons[i].rgb = randomColor();
            }
        }
    }
}

function createBall() {
    //speed - 25
    let ball = {
        x: event.offsetX,
        y: event.offsetY,
        dx: Math.ceil(Math.random() * 100) / 100 * speed * randomSign(), // or (/100 * 25)
        //dy: (25 - Math.abs(this.dx)) * randomSign(), имхо так не работает???
        rgb: randomColor(),
    };
    ball.dy = (speed - Math.abs(ball.dx)) * randomSign();
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
    if((event.offsetX>ballRadius)&&(event.offsetX<canvas.width- ballRadius)
        &&(event.offsetY>ballRadius)&&(event.offsetY<canvas.height- ballRadius)&&
        checkIsThereNoOneBall(event.offsetX,event.offsetY)){
        drawBall(createBall())
        }
});

setInterval(function () {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < balloons.length; i++){
        collide(i);
        draw(balloons[i]);
    }
},16);

let reset = document.getElementById('reset'); //add event Listener
reset.addEventListener('click', resets);

function resets () {
    balloons.length=0;
}

function checkIsThereNoOneBall(x,y){
    let trueOrFalse=true
    for(let obj in balloons){
        if(Math.sqrt((Math.abs(x-balloons[obj].x)**2)+(Math.abs(y-balloons[obj].y)**2))<=ballRadius*2){
            trueOrFalse=false
            break
        }  
    }
    return trueOrFalse
}