import CADElement from '../../base/element'
import {SVGURI} from '../../constant/'
import { FixedLineData, FixedLineStyle, FixedLineProp } from '../../constant/type'


class Line extends CADElement<FixedLineData, FixedLineStyle> {
  rel: SVGPathElement

  constructor({storkeColor = '#ccc', strokeWidth = 4, linecap = 'square', ...args}: FixedLineProp) {
    super(
      {
        data: [
          args.points[0].data.api.origin, 
          args.points[1].data.api.origin
        ],
        style: { strokeWidth, storkeColor: storkeColor, linecap },
        renderer: args.render,
        zIndex: args.zIndex
      }
    )
  }
  
  grentNode(): SVGElement {
    return document.createElementNS(SVGURI, 'path')
  }

  updateStyle() {
    let width = this.style.strokeWidth * this.multiple
    this.real.setAttribute('stroke', this.style.storkeColor)
    this.real.setAttribute('stroke-width', width.toString())
    this.real.setAttribute('stroke-linecap', this.style.linecap)
  }

  updateData() {
    this.real.setAttribute('d', `M ${this.data[0].x} ${this.data[0].y} L ${this.data[1].x} ${this.data[1].y}`)
  }
}

export default Line