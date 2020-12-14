import responsive, { Interact } from 'data-interact'
import { ElementArgs, Style, point } from '../constant/type'
import Renderer from './render'
import { throttle } from '../util'

// 让渲染器与ele挂钩
const initRender = (ele: CADElement, renderer: Renderer, zIndex: number) => {
  if (!renderer) return;

  ele.zIndex = zIndex || 0
  ele.real = ele.grentNode()

  // 修改渲染器的适合及时更新视图
  renderer.convert.api.update(ele.update)
  renderer.push(ele)
  
  Object.defineProperties(ele, {
    multiple: {
      get: () => renderer.convert.multiple / renderer.convert.scale
    }
  })

  ele.renderer = renderer

  bindDrag(ele)
}

const bindDrag = (ele: CADElement) => {
  const parent = document.documentElement

  ele.real.addEventListener('mousedown', (ev) => {
    const start = { x: ev.offsetX, y: ev.offsetY }
    ele.dragStart && ele.dragStart(start, ev)

    const moveHandle = throttle((ev: SVGElementEventMap['mousemove']) => {
      let curr = { x: ev.offsetX, y: ev.offsetY }
      let move = { x: curr.x - start.x, y: curr.y - start.y }

      ele.dragMove && ele.dragMove(move, curr, start, ev)
      ev.preventDefault()
    }, 10)

    const upHandle = (ev: SVGElementEventMap['mouseup']) => {
      ele.dragEnd && ele.dragEnd(ev)
      parent.removeEventListener('mousemove', moveHandle, false)
      parent.removeEventListener('mouseup', upHandle, false)
    }

    parent.addEventListener('mousemove', moveHandle, false)
    parent.addEventListener('mouseup', upHandle, false)
  })
}


abstract class CADElement<T = {}, I = {}> {
  // 解除自动关联方法
  private unAutoChangeStyle: () => void
  // 需要维护的核心数据
  data: Interact<T>
  // 需要维护的样式
  style: Interact<I>
  // 层级
  zIndex: number
  // 缩放
  multiple: number
  // 真实DOM
  real: SVGElement
  // 是否选中
  select: boolean
  // 渲染器
  renderer: Renderer
  

  constructor(args: ElementArgs<T, I> = {}) {
    const { data, style, renderer, zIndex } = args

    this.update = this.update.bind(this)
    this.intercept = this.intercept.bind(this)

    // 修改渲染器的适合及时更新视图
    initRender(this, renderer, zIndex)

    // 如果样式修改则渲染
    if (style) {
      this.style = responsive(style)
      renderer && this.style.api.update(this.update)
    }

    // 如果有拦截以及有数据
    if (data) {
      this.data = responsive(data)
      renderer && this.data.api.update(this.update)
      this.intercept && this.data.api.stop(this.intercept)
    }
  }

  // 自动悬浮，选中，等样式
  autoChangeStyle(hoverStyle: Style) {
    this.unAutoChangeStyle && this.unAutoChangeStyle()
    
    let prevStyle;
    let hover = false
    let selected = false;

    const setHoverStyle = () => {
      if (hover || selected) {
        prevStyle = { ...this.style.api.origin }
        for (let key in hoverStyle) {
          this.style[key] = hoverStyle[key]
        }
      }
    }
    const setUnHoverStyle = () => {
      if (!hover && !selected) {
        for (let key in prevStyle) {
          this.style[key] = prevStyle[key]
        }
        prevStyle = void 0;
      }
    }
    const enterHandle = () => {
      hover = true
      setHoverStyle()
    }
    const leaveHandle = () => {
      hover = false
      setHoverStyle()
    }

    Object.defineProperties(this, {
      selected: {
        get: () => selected,
        set: (val) => {
          if (selected === !!val) return;
          selected = !!val
          selected ? setHoverStyle() : setUnHoverStyle()
        },
        configurable: true
      }
    })

    this.real.addEventListener('mouseenter', enterHandle)
    this.real.addEventListener('mouseleave', leaveHandle)

    return this.unAutoChangeStyle = () => {
      this.real.removeEventListener('mouseenter', enterHandle)
      this.real.removeEventListener('mouseleave', leaveHandle)
    }
  }

  destory() {
    this.renderer.remove(this)
    this.unAutoChangeStyle && this.unAutoChangeStyle()
  }

  abstract dragStart?(pos: point, ev: SVGElementEventMap['mousedown'])
  abstract dragMove?(move: point, current: point, start: point, ev: SVGElementEventMap['mousemove'])
  abstract dragEnd?(ev: SVGElementEventMap['mouseup'])
  abstract intercept?()
  abstract grentNode(): SVGElement
  abstract drag(move: point)
  abstract update()
}

export default CADElement