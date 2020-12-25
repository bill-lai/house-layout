import responsive, { Interact } from 'data-interact'
import { ElementArgs, Style, point, DragStart } from '../constant/type'
import Renderer from './render'

// 让渲染器与ele挂钩
const initRender = (ele: CADElement, renderer: Renderer, zIndex: number) => {
  if (!renderer) return;

  ele.zIndex = zIndex || 0
  ele.real = ele.grentNode()

  // 修改渲染器的适合及时更新视图
  renderer.convert.api.update(
    () => {
      ele.updateStyle && ele.updateStyle()
      ele.updateData && ele.updateData()
    }
  )
  renderer.push(ele)
  
  // 将当前对象挂钩渲染器
  Object.defineProperties(ele, {
    multiple: {
      get: () => renderer.convert.multiple / renderer.convert.scale
    }
  })

  ele.renderer = renderer

  return bindDrag(ele)
}

// 绑定鼠标操作
const bindDrag = (ele: CADElement) => {
  const parent = document.documentElement
  const mousedownHandle = (ev) => {
    const start = { x: ev.offsetX, y: ev.offsetY }
    ele.dragStart && ele.dragStart(start, ev)

    const moveHandle = (ev: SVGElementEventMap['mousemove']) => {
      let curr = { x: ev.offsetX, y: ev.offsetY }
      let move = { x: curr.x - start.x, y: curr.y - start.y }

      ele.dragMove && ele.dragMove(move, curr, start, ev)
      ev.preventDefault()
    }

    const upHandle = (ev: SVGElementEventMap['mouseup']) => {
      ele.dragEnd && ele.dragEnd(ev)
      parent.removeEventListener('mousemove', moveHandle, false)
      parent.removeEventListener('mouseup', upHandle, false)
    }

    parent.addEventListener('mousemove', moveHandle, false)
    parent.addEventListener('mouseup', upHandle, false)
  }

  ele.real.addEventListener('mousedown', mousedownHandle)

  return () => {
    ele.real.removeEventListener('mousedown', mousedownHandle)
  }
}


abstract class CADElement<T = {}, I = {}> {

  // 解除自动关联方法
  private unAutoChangeStyle: () => void
  // 销毁初建绑定的一下方法数据
  private unInit: () => void
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

    this.updateStyle = this.updateStyle && this.updateStyle.bind(this)
    this.updateData = this.updateData && this.updateData.bind(this)
    this.intercept = this.intercept && this.intercept.bind(this)

    // 修改渲染器的适合及时更新视图
    this.unInit = initRender(this, renderer, zIndex)

    // 如果样式修改则渲染
    if (style) {
      this.style = responsive(style)
      this.updateStyle && this.style.api.update(this.updateStyle)
    }

    // 如果有拦截以及有数据
    if (data) {
      this.data = responsive(data)
      this.updateData && this.data.api.update(this.updateData)
      this.intercept && this.data.api.stop<T>(this.intercept)
    }

    
    this.updateStyle && this.updateStyle()
    this.updateData && this.updateData()
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
      setUnHoverStyle()
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
    this.unInit()
    this.unAutoChangeStyle && this.unAutoChangeStyle()
    this.renderer.remove(this)
  }

  
  dragStart?(pos: point, ev: SVGElementEventMap['mousedown'])
  dragMove?(move: point, current: point, start: point, ev: SVGElementEventMap['mousemove'])
  dragEnd?(ev: SVGElementEventMap['mouseup'])
  intercept?(data: Interact<T>)
  grentNode?(): SVGElement
  drag?(move: point)
  updateStyle?()
  updateData?()
}

export default CADElement
export { ElementArgs, Interact }