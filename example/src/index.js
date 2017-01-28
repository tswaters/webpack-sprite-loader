'use strict'

import smileyDead from './assets/smiley-dead.png'
import smileySmile from './assets/smiley-smile.png'

const sprites = document.getElementById('sprites')
const canvas = document.getElementById('canvas')
const width = canvas.width = 26
const height = canvas.height = 26
const ctx = canvas.getContext('2d')

const draw = isAlive => {
  const sprite = isAlive ? smileySmile : smileyDead
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(sprites, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, width, height)
  return !isAlive
}

let isAlive = draw(true)

canvas.addEventListener('click', () => isAlive = draw(isAlive))
