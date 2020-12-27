var message = "Happy New Year!!";
var msgCount = 0;
var blinkCount = 0;
var blinkFlg = 0;
var timer1, timer2;
var messageLabel = document.getElementById("messageLabel");

function textFunc() {
    messageLabel.innerHTML = message.substring(0, msgCount);

    if (msgCount == message.length) {
        // Stop timer
        clearInterval(timer1);

        // Start blinking animation!
        timer2 = setInterval("blinkFunc()", 200);
    } else {
        msgCount++;
    }
}

function blinkFunc() {
    // blink 5 times.
    if (blinkCount < 6) {
        if (blinkFlg == 0) {
            messageLabel.innerHTML = message;
            blinkFlg = 1;
            blinkCount++;
        } else {
            messageLabel.innerHTML = "";
            blinkFlg = 0;
        }
    } else {
        // Stop timer
        clearInterval(timer2);
    }
}
timer1 = setInterval("textFunc()", 150); // every 150 milliseconds


// ======================================================================================
// ========================== fireworks =================================================
$(function() {
    var canvas = $('#canvas')[0];
    canvas.width = $('main').width();
    canvas.height = $('main').height();
    var ctx = canvas.getContext('2d');

    // resize
    $(window).on('resize', function() {
        canvas.width = $('main').width();
        canvas.height = $('main').height();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // init
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // objects
    var listFire = [];
    var listFirework = [];
    var fireNumber = 10;
    var center = { x: canvas.width / 2, y: canvas.height / 2 };
    var range = 100;
    for (var i = 0; i < fireNumber; i++) {
        var fire = {
            x: Math.random() * range / 2 - range / 4 + center.x,
            y: Math.random() * range * 2 + canvas.height,
            size: Math.random() + 0.5,
            fill: '#fd1',
            vx: Math.random() - 0.5,
            vy: -(Math.random() + 4),
            ax: Math.random() * 0.02 - 0.01,
            far: Math.random() * range + (center.y - range)
        };
        fire.base = {
            x: fire.x,
            y: fire.y,
            vx: fire.vx
        };
        //
        listFire.push(fire);
    }

    function randColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var color = 'rgb($r, $g, $b)';
        color = color.replace('$r', r);
        color = color.replace('$g', g);
        color = color.replace('$b', b);
        return color;
    }

    (function loop() {
        requestAnimationFrame(loop);
        update();
        draw();
    })();

    function update() {
        for (var i = 0; i < listFire.length; i++) {
            var fire = listFire[i];
            //
            if (fire.y <= fire.far) {
                // case add firework
                var color = randColor();
                for (var i = 0; i < fireNumber * 5; i++) {
                    var firework = {
                        x: fire.x,
                        y: fire.y,
                        size: Math.random() + 1.5,
                        fill: color,
                        vx: Math.random() * 5 - 2.5,
                        vy: Math.random() * -5 + 1.5,
                        ay: 0.05,
                        alpha: 1,
                        life: Math.round(Math.random() * range / 2) + range / 2
                    };
                    firework.base = {
                        life: firework.life,
                        size: firework.size
                    };
                    listFirework.push(firework);
                }
                // reset
                fire.y = fire.base.y;
                fire.x = fire.base.x;
                fire.vx = fire.base.vx;
                fire.ax = Math.random() * 0.02 - 0.01;
            }
            //
            fire.x += fire.vx;
            fire.y += fire.vy;
            fire.vx += fire.ax;
        }

        for (var i = listFirework.length - 1; i >= 0; i--) {
            var firework = listFirework[i];
            if (firework) {
                firework.x += firework.vx;
                firework.y += firework.vy;
                firework.vy += firework.ay;
                firework.alpha = firework.life / firework.base.life;
                firework.size = firework.alpha * firework.base.size;
                firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
                //
                firework.life--;
                if (firework.life <= 0) {
                    listFirework.splice(i, 1);
                }
            }
        }
    }

    function draw() {
        // clear
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // re-draw
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 1;
        for (var i = 0; i < listFire.length; i++) {
            var fire = listFire[i];
            ctx.beginPath();
            ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = fire.fill;
            ctx.fill();
        }

        for (var i = 0; i < listFirework.length; i++) {
            var firework = listFirework[i];
            ctx.globalAlpha = firework.alpha;
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = firework.fill;
            ctx.fill();
        }
    }
})