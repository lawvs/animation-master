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

const animation = async (shape, step = false) => {
  // https://easings.net/#
  const easeInOutBack = 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
  const easeOutBack = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

  await sleep(1000)

  await shape.animate(
    [
      {
        transform: 'rotate(0)',
      },
      {
        transform: 'rotate(-45deg)',
      },
    ],
    {
      duration: 700,
      easing: step ? 'steps(1)' : easeInOutBack,
      fill: 'forwards',
    }
  ).finished

  await sleep(700)

  await shape.animate(
    [
      {
        transform: 'rotate(-45deg) scale(1)',
      },
      {
        transform: 'rotate(-45deg) scale(1.5)',
      },
    ],
    {
      duration: 700,
      easing: step ? 'steps(1)' : easeInOutBack,
      fill: 'forwards',
    }
  ).finished

  await sleep(300)

  await shape.animate(
    [
      {
        transform: 'rotate(-45deg) scale(1.5)',
      },
      {
        transform: 'rotate(-45deg) scale(1)',
      },
    ],
    {
      duration: 500,
      easing: step ? 'steps(1)' : easeOutBack,
      fill: 'forwards',
    }
  ).finished

  await sleep(300)

  await shape.animate(
    [
      {
        transform: 'rotate(-45deg)',
      },
      {
        transform: 'rotate(0)',
      },
    ],
    {
      duration: 500,
      easing: step ? 'steps(1)' : easeInOutBack,
      fill: 'forwards',
    }
  ).finished
}

const main = async () => {
  const shapeA = document.querySelector('.a')
  const shapeB = document.querySelector('.b')
  while (true) {
    const a1 = animation(shapeA)
    const a2 = animation(shapeB, true)
    await Promise.all([a1, a2])
  }
}

main()
