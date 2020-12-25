import { Render, MovePoint } from '../src/index'
import FixedLine from '../src/member/line/move'

let render = new Render(document.querySelector('#cad'))
let point1 = new MovePoint({x: 100, y: 100, render, zIndex: 1})
let point2 = new MovePoint({x: 100, y: 200, render, zIndex: 1})

let line = new FixedLine({ points: [point1, point2], render })

