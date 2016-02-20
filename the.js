'use strict'
var size = 658
var canvas = document.getElementById('pablo-canvas')
canvas.width = canvas.height = size

var context = canvas.getContext('2d')

function fillEntireCanvas (color) {
  context.beginPath()
  context.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = color
  context.fill()
}

function textVariations (text) {
  var index = text.lastIndexOf(' ')

  if (index === -1) {
    return {
      first: text,
      second: text,
      third: text
    }
  } else {
    var untilSpace = text.slice(0, index)
    var afterSpace = text.slice(index + 1)

    return {
      first: untilSpace + '        ' + afterSpace,
      second: untilSpace + '    ' + afterSpace,
      third: untilSpace + '      ' + afterSpace,
    }
  }
}

function drawImage(image, pos, size, callback) {
   loadImage(image, function() {
      context.drawImage(this, pos.x, pos.y, size.width, size.height)
      callback()
   })
}

function repeatText (opts) {
  var times = opts.times
  var gap = opts.gap
  var x = opts.x
  var text = opts.text

  var y = opts.y
  for (var i = 0; i < times; i++, y+= gap) {
    context.fillText(text, x, y)
  }

  return {
    y: y,
    gap: gap
  }
}

var imageCache = {}
function loadImage (url, callback) {
  if (imageCache[url]) {
    callback.call(imageCache[url])
  } else {
    var img = new Image()
    img.src = url

    img.onload = callback
    imageCache[url] = img
  }
}

function drawPablo (mainText, secondaryText, bootyPic, famPic, callback) {
  mainText = mainText.toUpperCase()
  secondaryText = secondaryText.toUpperCase()

  fillEntireCanvas('#F58B57')
  context.fillStyle = 'black'
  context.font = 'bold 43px sans-serif'

  var variations = textVariations(mainText)

  var mainX = 92
  var mainY = 64
  var mainGap = 50

  context.fillText(variations.first, mainX, mainY)

  var result = repeatText({
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

  var bootyDrawn = false
  var bootyPos = { x: 290, y: 457 }
  var bootySize = { width: 179, height: 154 }

  drawImage(bootyPic, bootyPos, bootySize, function() {
    bootyDrawn = true
    runCallbackIfReady()
  })

  var famDrawn = false
  var famPos = { x: 261, y: 182 }
  var famSize = { width: 261, height: 182 }

  drawImage(famPic, famPos, famSize, function() {
    famDrawn = true
    runCallbackIfReady()
  })

  function runCallbackIfReady () {
    if (bootyDrawn && famDrawn) {
      callback()
    }
  }
}

var mainEl = document.getElementById('main-text')
var secondaryEl = document.getElementById('secondary-text')

var famPicEl = document.getElementById('fam-pic')
var bootyPicEl = document.getElementById('booty-pic')

var famLabelEl = document.getElementById('fam-label')
var bootyLabelEl = document.getElementById('booty-label')

var defaultBooty = 'booty.jpg'
var defaultFam = 'fam.jpg'

var finalImageEl = document.getElementById('pablo-img')

function choosePic (files, _default) {
  if (files.length) {
    return {
      pic: URL.createObjectURL(files[0]),
      label: files[0].name
    }
  } else {
    return {
      pic: _default,
      label: _default
    }
  }
}

function refresh () {
  var booty = choosePic(bootyPicEl.files, defaultBooty)
  var fam = choosePic(famPicEl.files, defaultFam)

  drawPablo(mainEl.value, secondaryEl.value, booty.pic, fam.pic, function () {
    var pabloDataURL = canvas.toDataURL('image/png')
    finalImageEl.src = pabloDataURL

    famLabelEl.innerHTML = fam.label
    bootyLabelEl.innerHTML = booty.label
  })
}

mainEl.onkeyup = refresh
secondaryEl.onkeyup = refresh
bootyPicEl.onchange = refresh
famPicEl.onchange = refresh
refresh()
