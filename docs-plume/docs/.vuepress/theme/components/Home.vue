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
            particles: []
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
            requestAnimationFrame(_this.draw)
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
