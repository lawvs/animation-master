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

/**
 * @param {Element} element
 * @param {number} [from]
 * @param {number} [to]
 * @param {number} [duration]
 */
const rotateHelper = (element, from = 0, to = 0, duration = 100) =>
  element.animate(
    [
      {
        transform: `rotate(${from}deg)`,
      },
      {
        transform: `rotate(${to}deg)`,
      },
    ],
    {
      duration,
      easing: 'ease',
      fill: 'forwards',
    }
  )

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

  await rotateHelper(shapeB, 0, 7, 200).finished
  await rotateHelper(shapeB, 7, -45, 700).finished

  const animateA = shapeA.animate(...blurAnimateArgs)
  const animateC = shapeC.animate(...blurAnimateArgs)

  await rotateHelper(shapeB, -45, -42, 200).finished
  for (let i = 0; i < 3; i++) {
    await rotateHelper(shapeB, -42, -36).finished
    await rotateHelper(shapeB, -36, -42).finished
  }
  await rotateHelper(shapeB, -42, -36).finished
  await rotateHelper(shapeB, -36, -47, 200).finished

  await sleep(400)

  animateA.reverse()
  animateC.reverse()

  await rotateHelper(shapeB, -47, 2, 400).finished
  await rotateHelper(shapeB, 2, 0, 200).finished
}

const main = async () => {
  while (true) await animation()
}

main()
