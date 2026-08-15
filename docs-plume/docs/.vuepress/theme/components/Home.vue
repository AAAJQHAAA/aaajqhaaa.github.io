<template>
    <canvas></canvas>
</template>

<script>
import { FireWork, Particle } from './home/Fire.js'
export default {
    name: "home",
    data() {
        return {
            timeTicker: 0,
            // 动画执行80次，发射8个烟花
            timeTotal: 80,
            fireworks: [],
            // 一个烟花有多少个粒子
            particlesCount: 50,
            particles: [],
            ball: {
                x: 100, y: 100,// 起始坐标
                vx: 10, vy: 10,// 加速度
                radius: 25,// 半径
                color: "white",// 颜色
            }
        }
    },
    methods: {
        // 烟花
        draw() {
            function getRandomRange(min, max) {
                return Math.random() * (max - min) + min
            }
            let _this = this;
            const canvas = document.querySelector('canvas')
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d')
            // 清除画布（透明背景）
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 画烟花
            for (let index = 0; index < _this.fireworks.length; index++) {
                const firework = _this.fireworks[index]
                firework.draw(ctx)
                if (firework.isArrived()) {
                    _this.fireworks.splice(index, 1)
                    index--
                    for (let j = 0; j < _this.particlesCount; j++) {
                        _this.particles.push(
                            new Particle(
                                ...firework.getTargetCoordinate(),
                                firework.getHue()
                            )
                        )
                    }
                }
            }

            // 画粒子
            for (let index = 0; index < _this.particles.length; index++) {
                const particle = _this.particles[index]
                particle.draw(ctx)
                if (particle.isVanished()) {
                    _this.particles.splice(index, 1)
                    index--
                }
            }

            // 函数循环80次自动发射8支烟花
            if (_this.timeTicker >= _this.timeTotal) {
                for (let index = 0; index < _this.timeTotal / 10; index++) {
                    _this.fireworks.push(
                        // 起始点，结束点
                        new FireWork(
                            getRandomRange(0, canvas.width),
                            getRandomRange(0, canvas.height),
                            getRandomRange(0, canvas.width),
                            getRandomRange(0, canvas.height)
                        )
                    )
                }
                _this.timeTicker = 0
            } else {
                _this.timeTicker++
            }
            this.clock();
            this.drawBall();
            requestAnimationFrame(_this.draw)
        },
        // 时钟
        clock() {
            const canvas = document.querySelector('canvas')
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d')
            const now = new Date();
            ctx.save();
            // ctx.clearRect(50, 50, 200, 200);
            ctx.translate(canvas.width / 2, canvas.height / 2);// 平移坐标系
            ctx.scale(1, 1);// 缩放坐标系
            ctx.rotate(-Math.PI / 2);// 旋转坐标系-90度（x+指向上方）
            ctx.strokeStyle = "white";// 线段黑色
            ctx.fillStyle = "white";// 填充白色
            ctx.lineWidth = 1;// 线宽
            ctx.lineCap = "round";// 线段端点样式

            // Hour marks（小时线-刻度）
            ctx.save();
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 6);// （坐标系）每次旋转30度画小时线（从1画到12）
                ctx.moveTo(100, 0);
                ctx.lineTo(120, 0);
                ctx.stroke();
            }
            ctx.restore();

            // 刻度数字（x+指向上方）
            ctx.save();
            ctx.font = '10px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.rotate(Math.PI / 2); //（坐标系）旋转90度（x+指向右边）
            for (let i = 1; i <= 12; i++) {
                const theta = ((i - 3) * (Math.PI * 2)) / 12;// 四个区域，每个区域三份
                const x = 85 * Math.cos(theta);// cos (θ) = 邻边 / 斜边
                const y = 85 * Math.sin(theta);// sin (θ) = 对边 / 斜边
                ctx.fillText(i, x, y);
            }
            ctx.restore();

            // Minute marks（分钟线-刻度）（x+指向上方）
            ctx.save();
            ctx.lineWidth = 1;
            for (let i = 0; i < 60; i++) {
                if (i % 5 !== 0) {
                    ctx.beginPath();
                    ctx.moveTo(117, 0);
                    ctx.lineTo(120, 0);
                    ctx.stroke();
                }
                ctx.rotate(Math.PI / 30);// （坐标系）每次旋转6度画分钟线（从1画到60）
            }
            ctx.restore();

            const sec = now.getSeconds();// 视觉上：一秒跳一次
            // 显示秒针扫过的时钟, 使用:
            // const sec = now.getSeconds() + now.getMilliseconds() / 1000;// 视觉上一直在旋转
            const min = now.getMinutes();// 分钟
            const hr = now.getHours() % 12;// 小时

            ctx.fillStyle = "black";
            // Write Hours（时针）
            ctx.save();
            ctx.rotate((Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-20, 0);
            ctx.lineTo(80, 0);
            ctx.stroke();
            ctx.restore();

            // Write Minutes（分针）
            ctx.save();
            ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-28, 0);
            ctx.lineTo(112, 0);
            ctx.stroke();
            ctx.restore();

            // Write seconds（秒针）
            ctx.save();
            ctx.rotate((sec * Math.PI) / 30);
            ctx.strokeStyle = "#D40000";
            ctx.fillStyle = "#D40000";
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(83, 0);
            ctx.stroke();
            ctx.moveTo(94, 0);
            ctx.lineTo(99, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(90, 0, 4, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "rgb(0 0 0)";
            ctx.arc(0, 0, 3, 0, Math.PI * 2, true);// 空心白色
            ctx.fill();
            ctx.restore();

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "white";
            ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
            ctx.stroke();

            ctx.restore();
        },
        drawBall() {
            const canvas = document.querySelector('canvas')
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d')
            const ball = this.ball;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = ball.color;
            ctx.fill();
            ball.x += ball.vx;// 加
            ball.y += ball.vy;// 加
            // 加速度衰减
            // ball.vy *= 0.99;
            // ball.vy += 0.25;

            // 边界反弹
            if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
                // y轴：球的位置+速度>边界-半径（速度为+），球的位置+速度<半径（速度为-）
                ball.vy = -ball.vy;
            }
            if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
                // x轴：球的位置+速度>边界-半径（速度为+），球的位置+速度<半径（速度为-）
                ball.vx = -ball.vx;
            }
        }
    },
    mounted() {
        const canvas = document.querySelector('canvas')
        // //canvas充满窗口
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.draw();
        window.addEventListener('resize', () => {
            //canvas充满窗口
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }, false);
    }
}
</script>

<style scoped lang="scss">
canvas {
    position: relative;
    height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 0px));
    width: 100%;
}
</style>
