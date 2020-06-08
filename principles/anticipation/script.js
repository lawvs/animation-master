const sleep = (duration) =>
  new Promise((res) => setTimeout(() => res(), duration))

// polyfill `animate.finished`
// See https://github.com/web-animations/web-animations-js/blob/dev/src/web-animations-next-animation.js#L168
window.Element.prototype.animate = new Proxy(window.Element.prototype.animate, {
  apply(target, ctx, args) {
    const [keyframes, options] = args
    let animateDuration = 0

    if (typeof options === 'object') {
      animateDuration =
        (options.duration || 0) + (options.delay || 0) + (options.endDelay || 0)
    } else if (options) {
      animateDuration = options
    } else {
      animateDuration = 0
    }

    const animate = Reflect.apply(target, ctx, args)

    animate.finished = new Promise((res) =>
      setTimeout(() => res(animate), animateDuration)
    )
    return animate
  },
})

const animation = async () => {
  const shape = document.querySelector('.shape')

  await sleep(500)

  // prepare
  await shape.animate(
    [
      {
        transform: 'rotate(0)',
        right: 'calc(50% - var(--shape-width) / 2)',
        opacity: 0,
      },
      {
        transform: 'rotate(0)',
        right: 'calc(50% - var(--shape-width) / 2)',
        opacity: 1,
      },
    ],
    {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards',
    }
  ).finished

  await shape.animate(
    [
      {
        right: 'calc(50% - var(--shape-width) / 2)',
      },
      {
        right:
          'calc(50% - var(--shape-width) * 3 / 4 + var(--surface-width) / 2)',
      },
    ],
    {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
    }
  ).finished
  await sleep(500)

  await shape.animate(
    [
      {
        right:
          'calc(50% - var(--shape-width) * 3 / 4 + var(--surface-width) / 2)',
      },
      {
        right: 'calc(50% - var(--shape-width) / 2 + var(--surface-width) / 2)',
      },
    ],
    {
      duration: 100,
      easing: 'ease-out',
      fill: 'forwards',
    }
  ).finished
  await sleep(500)

  // unbalanced

  await shape.animate(
    [
      {
        transform: 'rotate(0)',
      },
      {
        transform: 'rotate(-30deg)',
      },
    ],
    {
      duration: 500,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished

  await shape.animate(
    [
      {
        transform: 'rotate(-30deg)',
      },
      {
        transform: 'rotate(-15deg)',
      },
    ],
    {
      duration: 700,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished

  await shape.animate(
    [
      {
        transform: 'rotate(-15deg)',
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

  // falls off

  await shape.animate(
    [
      {
        transform: 'rotate(-45deg)',
        opacity: 1,
      },
      {
        transform: 'translate(-80%, 100%) rotate(-95deg) ',
        opacity: 0,
      },
    ],
    {
      duration: 1000,
      easing: 'ease',
      fill: 'forwards',
    }
  ).finished
}

const main = async () => {
  while (true) await animation()
}

main()
