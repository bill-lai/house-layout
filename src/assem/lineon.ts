import CADElement from '../base/element'
import FixedLine from '../member/line/fixed'
import { isContainPoint } from '../util/geomerty'
import {LineAssemData, LineAssemProp, FixedLineData, point, line} from '../constant/type'

// 同一线条所有建筑归为一个数组
export const lineAttaAssems = new Map<FixedLineData, Array<LineAssem>>()

// 点是否包含在传入的结构依附点里面
const isAssemsContainPoint = (Assems: Array<LineAssem>, point: point): boolean => {
  return Assems.some(Assem => {
    if (Assem.data.linePoints.length === 1) return false
    let line: line = [
      Assem.data.linePoints[0], 
      Assem.data.linePoints[Assem.data.linePoints.length - 1]
    ]
    return isContainPoint(line, point)
  })
}


// 线是否与传入的结构依附点里面重合
const isAssemsContainLine = (Assems: Array<LineAssem>, line: line): boolean => {
  return Assems.some(Assem => {
    if (Assem.data.linePoints.length === 1) {
      return isContainPoint(line, Assem.data.linePoints[0])
    } else {
      let checkLine: line = [
        Assem.data.linePoints[0], 
        Assem.data.linePoints[Assem.data.linePoints.length - 1]
      ]
      return isContainPoint(checkLine, line[0]) || isContainPoint(checkLine, line[1])
    }
  })
}

abstract class LineAssem extends CADElement<LineAssemData> {

  constructor(args: LineAssemProp) {
    if (args.linePoints.length === 0) {
      throw `linePoints ${args.linePoints} 为无效的依附点`
    }

    super(
      {
        data: {
          points: args.points.map(point => point.data.api.origin),
          attachment: args.attachment.data.api.origin,
          linePoints: args.linePoints.map(point => point.data.api.origin),
        },
        renderer: args.render,
        zIndex: args.zIndex
      }
    )

    let lineAttaAssem = lineAttaAssems.get(this.data.attachment)
    if (lineAttaAssem) {
      lineAttaAssem.push(this)
    } else {
      lineAttaAssems.set(this.data.attachment, [this])
    }

    this.data.api.stop('linePoints', this.pointStop.bind(this))
  }

  // 设置新的附属线条
  setAttachment(newAttachment: FixedLine) {
    if (this.data.attachment === newAttachment.data.api.origin) return;

    let oldAssems = lineAttaAssems.get(this.data.attachment)
    let newAssems = lineAttaAssems.get(newAttachment.data.api.origin)

    if (!newAssems) {
      newAssems = []
      lineAttaAssems.set(newAttachment.data.api.origin, newAssems)
    }

    let delIndex = oldAssems.indexOf(this)
    ~delIndex && oldAssems.splice(oldAssems.indexOf(this), 1)

    newAssems.push(this)

    this.data.attachment = newAttachment.data.api.origin
  }
  
  // 点是否在沿线上
  isSeparate(points = this.data.linePoints) : boolean {
    return points.some(point => isContainPoint(this.data.attachment, point))
  }
  
  // 检测同一线条所有建筑依附点是否重叠
  isOverlap(checkAssem = this) : boolean {
    let Assems = lineAttaAssems.get(checkAssem.data.attachment)
      .filter(Assem => Assem !== checkAssem)

    if (Assems.length === 0) return false

    if (checkAssem.data.linePoints.length === 1) {
      return isAssemsContainPoint(
        Assems, 
        checkAssem.data.linePoints[0]
      )
    } else {
      return isAssemsContainLine(
        Assems,
        [
          checkAssem.data.linePoints[0], 
          checkAssem.data.linePoints[checkAssem.data.linePoints.length - 1]
        ]
      )
    }
  }

  // 点数据变化检测
  pointStop() {
    return !this.isSeparate() && !this.isOverlap()
  }

  destory() {
    super.destory()
    let asseblys = lineAttaAssems.get(this.data.attachment)
    let index = asseblys.indexOf(this)
    ~index && asseblys.splice(index, 1)
    this.data = null;
  }
}

export default LineAssem