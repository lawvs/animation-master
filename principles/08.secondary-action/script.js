const sleep = (duration) =>
  new Promise((res) => setTimeout(() => res(), duration))


/**
 *
 * @param {Element} element
 * @param {DOMRect} prevRect
 * @param {KeyframeAnimationOptions} keyframeOptions
 */
const flipAnimation = async (element, prevRect, keyframeOptions) => {
  const curRect = element.getBoundingClientRect()

  const invert = {
    left: prevRect.left - curRect.left,
    top: prevRect.top - curRect.top,
  }

  const keyframes = [
    {
      transform: `translate(${invert.left}px, ${invert.top}px)`,
    },
    { transform: 'translate(0)' },
  ]

  const easeInOutBack = 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
  const options = {
    duration: 1000,
    easing: easeInOutBack,
    fill: 'backwards',
    ...keyframeOptions,
  }

  await element.animate(keyframes, options).finished
}

/**
 * @param {Element} element
 */
const beforeInsertAnimation = async (element) => {
  await element.animate(
    [
      {
        transform: `translateY(150%)`,
        opacity: 0,
      },
      { transform: 'translateY(120%)', opacity: 1 },
    ],
    {
      duration: 500,
      easing: 'linear',
      fill: 'both',
    }
  ).finished

  await sleep(300)

  const bounce = element.animate(
    [
      {
        transform: `translateY(120%)`,
      },
      { transform: 'translateY(110%)' },
    ],
    {
      duration: 200,
      easing: 'linear',
      direction: 'alternate',
    }
  )

  await bounce.finished

  // bounce.currentTime = 0
  bounce.play()
  await sleep(200)
}

/**
 * @param {Element} element
 */
const insertAnimation = async (element) => {
  await beforeInsertAnimation(element)

  await sleep(700)

  const keyframes = [
    {
      transform: `translateY(120%)`,
    },
    { transform: 'translateY(0)' },
  ]

  await element.animate(keyframes, {
    duration: 700,
    easing: 'linear',
    fill: 'both',
  }).finished
}

/**
 * @param {Element} element
 */
const removeAnimation = async (element) => {
  const keyframes = [
    {
      transform: `translateY(0)`,
      opacity: 1,
    },
    { transform: 'translateY(-110%)', opacity: 0 },
  ]

  await element.animate(keyframes, {
    duration: 700,
    easing: 'linear',
    fill: 'forwards',
  }).finished
}

const main = async () => {
  const shapes = Array.from(document.querySelectorAll('.shape'))
  const newShape = document.createElement('div')

  while (true) {
    let prevRects = shapes.map((shape) => shape.getBoundingClientRect())
    newShape.classList.add('shape')

    await sleep(1000)

    // Add new element
    shapes[0].after(newShape)

    await Promise.all([
      insertAnimation(newShape),
      ...shapes.map((shape, i) =>
        flipAnimation(shape, prevRects[i], { delay: 1300 })
      ),
    ])

    await sleep(1000)

    prevRects = shapes.map((shape) => shape.getBoundingClientRect())

    await removeAnimation(newShape)
    newShape.remove()

    await Promise.all(
      shapes.map((shape, i) => flipAnimation(shape, prevRects[i]))
    )
  }
}

main()
