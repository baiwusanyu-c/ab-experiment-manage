
<template>
    <div>
        <div class="circle-container" v-for="index in 100" :key = 'index + "circle-container-yh"'>
            <div class="circle"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .circle-container {
        $particleNum: 200;
        $particleColor: hsl(180, 100%, 80%);
        position: absolute;
        transform: translateY(-10vh);
        left: 0;
        top: 0;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        z-index: 1;
    .circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        mix-blend-mode: screen;
        background-image: radial-gradient(
                hsl(180, 100%, 80%),
                hsl(180, 100%, 80%) 10%,
                hsla(180, 100%, 80%, 0) 56%
        );

        animation: fadein-frames 200ms infinite, scale-frames 2s infinite;

    @keyframes fade-frames {
        0% {
            opacity: 1;
        }

        50% {
            opacity: 0.7;
        }

        100% {
            opacity: 1;
        }
    }

    @keyframes scale-frames {
        0% {
            transform: scale3d(0.4, 0.4, 1);
        }

        50% {
            transform: scale3d(2.2, 2.2, 1);
        }

        100% {
            transform: scale3d(0.4, 0.4, 1);
        }
    }
    }

    $particleBaseSize: 8;


    @for $i from 1 through $particleNum {
    &:nth-child(#{$i}) {
        $circleSize: random($particleBaseSize) + 5;
        width: $circleSize + px;
        height: $circleSize + px;

        $startPositionY: random(10) + 100;
        $framesName: "move-frames-" + $i;
        $moveDuration: 28000 + random(9000) + ms;

        animation-name: #{$framesName};
        animation-duration: $moveDuration;
        animation-delay: random(35000) + ms;

        @keyframes #{$framesName} {
            from {
                transform: translate3d(
                        #{random(100) + vw},
                        #{$startPositionY + vh},
                        0
                );
            }

            to {
                transform: translate3d(
                        #{random(100) + vw},
                        #{- $startPositionY - random(30) + vh},
                        0
                );
            }
        }

        .circle {
            animation-delay: random(4000) + ms;
        }
    }
    }
    }

</style>
