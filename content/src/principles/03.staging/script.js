const sleep = (duration) =>
  new Promise((res) => setTimeout(() => res(), duration))

// A simple polyfill for `animate.finished`
// For full implementation please see
// https://github.com/web-animations/web-animations-js/blob/dev/src/web-animations-next-animation.js#L168
if (!('finished' in Animation.prototype)) {
  window.Element.prototype.animate = new Proxy(
    window.Element.prototype.animate,
    {
      apply(target, ctx, args) {
        const animate = Reflect.apply(target, ctx, args)

        animate.finished = new Promise((res) => {
          if (animate.playState === 'finished') {
            res(animate)
            return
          }

          animate.addEventListener('finish', () => res(animate), {
            once: true,
            passive: true,
          })
        })
        return animate
      },
    }
  )
}

const animation = async () => {
  const shapeA = document.querySelector('.a')
  const shapeB = document.querySelector('.b')
  const shapeC = document.querySelector('.c')

  await sleep(1500)

  const blurAnimateArgs = [
    [
      {
        filter: 'blur(0)',
      },
      {
        filter: 'blur(5px)',
      },
    ],
    {
      duration: 700,
      easing: 'ease',
      fill: 'forwards',
    },
  ]

  await shapeB.animate(
    [
      {
        transform: 'rotate(0)',
      },
      {
        transform: 'rotate(7deg)',
      },
    ],
    {
      duration: 200,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished

  await shapeB.animate(
    [
      {
        transform: 'rotate(7deg)',
      },
      {
        transform: 'rotate(-45deg)',
      },
    ],
    {
      duration: 700,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished

  const animateA = shapeA.animate(...blurAnimateArgs)
  const animateC = shapeC.animate(...blurAnimateArgs)

  await shapeB.animate(
    [
      {
        transform: 'rotate(-45deg)',
      },
      {
        transform: 'rotate(-42deg)',
      },
    ],
    {
      duration: 200,
      fill: 'forwards',
    }
  ).finished

  const shakeAnimate = await shapeB.animate(
    [
      {
        transform: 'rotate(-42deg)',
      },
      {
        transform: 'rotate(-36deg)',
      },
    ],
    {
      duration: 100,
      fill: 'forwards',
    }
  ).finished

  shakeAnimate.reverse()
  await sleep(100)
  shakeAnimate.reverse()
  await sleep(100)
  shakeAnimate.reverse()
  await sleep(100)
  shakeAnimate.reverse()
  await sleep(100)
  shakeAnimate.reverse()

  await sleep(400)

  animateA.reverse()
  animateC.reverse()

  await shapeB.animate(
    [
      {
        transform: 'rotate(-42deg)',
      },
      {
        transform: 'rotate(2deg)',
      },
    ],
    {
      duration: 400,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished

  await shapeB.animate(
    [
      {
        transform: 'rotate(2deg)',
      },
      {
        transform: 'rotate(0)',
      },
    ],
    {
      duration: 200,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished
}

const main = async () => {
  while (true) await animation()
}

main()
