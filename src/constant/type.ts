import Renderer from '../base/render'

export type point = {x: number, y:number};

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

export type Style = {
  [key: string]: string
}

export type ElementArgs<T, I> = {
  data?: T,
  style?: I,
  renderer?: Renderer,
  zIndex?: number,
  hoverStyle?: Style
}