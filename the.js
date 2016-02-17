'use strict'
const size = 658
const canvas = document.getElementById('pablo')
canvas.width = canvas.height = size

const context = canvas.getContext('2d')

function fillEntireCanvas (color) {
  context.beginPath()
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = color
  context.fill()
}

function textVariations (text) {
  const index = text.lastIndexOf(' ')

  if (index === -1) {
    return {
      first: text,
      second: text,
      third: text
    }
  } else {
    const untilSpace = text.slice(0, index)
    const afterSpace = text.slice(index + 1)

    return {
      first: untilSpace + '        ' + afterSpace,
      second: untilSpace + '    ' + afterSpace,
      third: untilSpace + '      ' + afterSpace,
    }
  }
}

function repeatText (opts) {
  const times = opts.times
  const gap = opts.gap
  const x = opts.x
  const text = opts.text

  var y = opts.y
  for (var i = 0; i < times; i++, y+= gap) {
    context.fillText(text, x, y)
  }

  return {
    y: y,
    gap: gap
  }
}

const imageCache = {}
function loadImage (url, callback) {
  if (imageCache[url]) {
    callback.call(imageCache[url])
  } else {
    const img = new Image()
    img.src = url

    img.onload = callback
    imageCache[url] = img
  }
}

function drawPablo (mainText, secondaryText) {
  mainText = mainText.toUpperCase()
  secondaryText = secondaryText.toUpperCase()

  fillEntireCanvas('#F58B57')
  context.fillStyle = 'black'
  context.font = 'bold 43px sans-serif'

  const variations = textVariations(mainText)

  const mainX = 92
  const mainY = 64
  const mainGap = 50

  context.fillText(variations.first, mainX, mainY)

  const result = repeatText({
    times: 5,
    gap: mainGap,
    x: mainX,
    y: mainY + mainGap,
    text: variations.second
  })

  context.fillText(variations.third, mainX, result.y + result.gap)

  context.font = 'bold 17px sans-serif'

  repeatText({
    times: 10,
    gap: 21,
    x: 78,
    y: 436,
    text: secondaryText
  })

  repeatText({
    times: 10,
    gap: 21,
    x: 440,
    y: 436,
    text: secondaryText
  })

  loadImage('booty.jpg', function () {
    context.drawImage(this, 290, 457, this.width, this.height)
  })

  loadImage('fam.jpg', function () {
    context.drawImage(this, 132, 198, this.width, this.height)
  })
}

const mainEl = document.getElementById('main-text')
const secondaryEl = document.getElementById('secondary-text')

function refresh () {
  drawPablo(mainEl.value, secondaryEl.value)
}

mainEl.onkeyup = refresh
secondaryEl.onkeyup = refresh
refresh()
