import { Map } from './mapManager'

let canvas = document.querySelector('canvas')!;

let width = 1880;
let height = 950;

let map = new Map(canvas, width, height);

map.zoom = 4

map.draw();

let down = false;
let startPosX = 0;
let startPosY = 0;

canvas.addEventListener('mousedown', (event: MouseEvent) => {
  console.log(event)
  startPosX = event.x;
  startPosY = event.y;
  down = true;
})

canvas.addEventListener('mousemove', (event: MouseEvent) => {
  if (!down) return;
  map.moveMapBy(startPosX - event.x, startPosY - event.y)
  startPosX = event.x;
  startPosY = event.y;
})

canvas.addEventListener('mouseleave', (event: MouseEvent) => {
  down = false;
})

canvas.addEventListener('mouseup', (event: MouseEvent) => {
  down = false;
})

canvas.addEventListener('wheel', (event: WheelEvent) => {
  if (event.deltaY > 0) {
    map.zoomBy(-1.2);
  } else {
    map.zoomBy(1.2);
  }
})