import CADElement from '../../base/element'
import { SVGURI } from '../../constant'
import { FixedPointData, FixedPointStyle, FixedPointProp } from '../../constant/type'

class FixedPoint extends CADElement<FixedPointData, FixedPointStyle> {
  real: SVGEllipseElement

  constructor({ strokeWidth = 0, r = 4, r1 = 4, ...args }: FixedPointProp) {
    super(
      {
        data: { x: args.x, y: args.y },
        style: { strokeWidth, storkeColor: args.storkeColor, fillColor: args.fillColor, r, r1 },
        renderer: args.render,
        zIndex: args.zIndex
      }
    )
  }

  grentNode() {
    let point = document.createElementNS(SVGURI, 'ellipse')
    return point
  }

  updateStyle() {
    let r1 = this.style.r * this.multiple
    let r2 = this.style.r1 * this.multiple
    let strokeWidth = this.style.strokeWidth * this.multiple

    this.real.setAttribute('fill', this.style.fillColor)
    this.real.setAttribute('rx', r1.toString())
    this.real.setAttribute('ry', r2.toString())
    this.real.setAttribute('stroke-width', strokeWidth.toString())
    this.real.setAttribute('stroke', this.style.storkeColor)
  }

  updateData() {
    this.real.setAttribute('cx', this.data.x.toString())
    this.real.setAttribute('cy', this.data.y.toString())
  }
}


export default FixedPoint
