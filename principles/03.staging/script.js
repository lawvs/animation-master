const sleep = (duration) =>
  new Promise((res) => setTimeout(() => res(), duration))


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
