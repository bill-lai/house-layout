import { SVGURI, SVGPATH, SVGVERSION } from '../constant'
import { point, convert } from '../constant/type'
import responsive, { Interact } from 'data-interact'
import Element from './element'

class Renderer {
  private selectHandle: (ev: Event) => void
  layer: HTMLElement
  svg: SVGSVGElement
  g: SVGGElement
  convert: Interact<convert>
  elements: Array<Element>

  constructor(layer: HTMLElement) {
    this.layer = layer
    this.elements = []
    this.initDOM()
    this.initConvert()
  }

  // 初始化所有参数
  private initDOM() {
    this.svg = document.createElementNS(SVGURI, 'svg')
    this.g = document.createElementNS(SVGURI, 'g')

    this.layer.style.position = 'relative'
    this.svg.style.position = 'absolute'
    this.svg.style.left = '0'
    this.svg.style.top = '0'
    this.svg.style.right = '0'
    this.svg.style.bottom = '0'
    this.svg.setAttribute('version', SVGVERSION)
    this.svg.setAttribute('xmlns', SVGURI)
    this.svg.setAttribute('xmlns:xlink', SVGPATH)

    this.svg.appendChild(this.g)
    this.layer.appendChild(this.svg)

    this.selectHandle = ev => {
      this.elements.forEach(ele => {
        ele.select = ele.real.contains(ev.target as SVGGElement)
      })
    }
    // 监听所有点击选择
    this.layer.addEventListener('click', this.selectHandle)
  }

  // 初始化转化参数
  private initConvert() {
    this.convert = responsive({
      domWidth: this.layer.offsetWidth,
      domHeight: this.layer.offsetHeight,
      width: this.layer.offsetWidth,
      height: this.layer.offsetHeight,
      left: 0,
      top: 0,
      multiple: 1,
      scale: 1
    })
    // 代理监听
    this.convert.api.update(this.adapt.bind(this))
  }

  // 根据参数适应
  adapt() {
    let centerStepX = this.convert.width / 2 - this.convert.left
    let centerStepY = this.convert.height / 2 - this.convert.top

    this.g.setAttribute('transform', `
      translate(${this.convert.left},${this.convert.top})
      translate(${centerStepX},${centerStepY})
      scale(${this.convert.scale},${this.convert.scale})
      translate(${-centerStepX},${-centerStepY})
    `)
    this.svg.setAttribute('width', this.convert.domWidth.toString())
    this.svg.setAttribute('height', this.convert.domHeight.toString())
    this.svg.setAttribute('viewBox', `0 0 ${this.convert.width} ${this.convert.height}`)
  }

  // dom坐标转换为真实坐标
  screenToRealPoint({ x, y }: point): point {
    let centerStepX = this.convert.width / 2 - this.convert.left
    let centerStepY = this.convert.height / 2 - this.convert.top
    let width = this.convert.width / this.convert.multiple
    let height = this.convert.height / this.convert.multiple
    if (width == 0 || height == 0) {
      return {
        x: centerStepX,
        y: centerStepY
      };
    }
    else {
      return {
        x: ((x * this.convert.width) / width - this.convert.left - centerStepX) / this.convert.scale + centerStepX,
        y: ((y * this.convert.height) / height - this.convert.top - centerStepY) / this.convert.scale + centerStepY
      }
    }
  }

  // 点坐标转换真实坐标
  realPointToScreen({ x, y }: point) {
    let centerStepX = this.convert.width / 2 - this.convert.left
    let centerStepY = this.convert.height / 2 - this.convert.top
    let width = this.convert.width / this.convert.multiple
    let height = this.convert.height / this.convert.multiple

    return {
      x: ((x - centerStepX) * this.convert.scale + centerStepX + this.convert.left) * width / this.convert.width,
      y: ((y - centerStepY) * this.convert.scale + centerStepY + this.convert.top) * height / this.convert.height
    }
  }

  // 向渲染器加入元素
  push(ele: Element) {
    let prevEle = this.elements.find(qele => qele.zIndex > ele.zIndex)

    if (prevEle) {
      this.g.insertBefore(ele.real, prevEle.real)
      this.elements.splice(this.elements.indexOf(prevEle), 0, ele)
    } else {
      this.g.appendChild(ele.real)
      this.elements.push(ele)
    }
  }

  // 向渲染器删除元素
  remove(ele) {
    this.g.removeChild(ele.real)
    this.elements.splice(this.elements.indexOf(ele), 1)
  }

  // 销毁时
  destroy() {
    this.layer.removeChild(this.svg)
    this.layer.removeEventListener('click', this.selectHandle)
  }
}

export default Renderer