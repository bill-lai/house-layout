import Renderer from '../base/render'
import FixedPoint from '../member/point/fixed'
import LinePoint from '../member/point/limitLine'
import FixedLine from '../member/line/fixed'

export type point = {x: number, y:number};
export type line = [point, point];
export type polygon = Array<point>

// 容器比例尺
export type convert = {
  domWidth: number, 
  domHeight: number, 
  left: number;
  top: number;
  width: number;
  height: number,
  multiple: number,
  scale: number
}

// 样式
export type Style = {
  [key: string]: string
}

// 基类element参数
export type ElementArgs<T, I> = {
  data?: T,
  style?: I,
  renderer?: Renderer,
  zIndex?: number,
  hoverStyle?: Style
}

// 所有组件类都需要的参数
export type pubAssem = {
  render: Renderer,
  zIndex?: number
}

// 组件基类所需要的一些方法
export interface DragStart {
  (pos: point, ev: SVGElementEventMap['mousedown']): void
}


// 大部分组件类公用样式
export type baseStyle = {
  strokeWidth?: number,
  fillColor?: string,
  storkeColor?: string,
  show?: string
}

// 点样式
export type FixedPointStyle = {
  r?: number,
  r1?: number,
} & baseStyle

// 点数据
export type FixedPointData = {
  x: number,
  y: number
}

// 固定点参数
export type FixedPointProp = FixedPointStyle & FixedPointData & pubAssem


// 沿线点参数
export type LinePointProp = FixedPointProp & { attachment: FixedLine }

// 沿线点数据
export type LinePointData = FixedPointData & { attachment: FixedLineData }


// 固定线样式
export type FixedLineStyle = { linecap?: string } & baseStyle

// 固定线数据
export type FixedLineData = [ FixedPointData, FixedPointData ]

// 固定线参数
export type FixedLineProp = { points: [FixedPoint, FixedPoint] } & FixedLineStyle & pubAssem



// 抽象类墙部件给Element传递的参数
export type LineAssemData = { attachment: FixedLineData, points: Array<FixedPointData>, linePoints: Array<LinePointData> }

// 抽象类墙部件需要的参数
export type LineAssemProp = { attachment: FixedLine, points: Array<FixedPoint>, linePoints: Array<LinePoint>  } & pubAssem

// 常规墙体抽象类需要的参数
export type RoutineAssemProp = LineAssemProp & {
  linePoints: [LinePoint, LinePoint]
  minWidth?: number
}

// 常规墙体抽象类需要给Element传递的参数
export type RoutineAssemData = LineAssemData & {
  linePoints: [LinePointData, LinePointData]
}