import MovePoint from './move'
import { getLinePoint, isContainPoint, lineDis } from '../../util/geomerty'
import { LinePointProp, LinePointData } from '../../constant/type'
import { Interact } from 'data-interact'

class LimitLine extends MovePoint {
  data: Interact<LinePointData>

  constructor(args: LinePointProp) {
    super(args)

    this.data.attachment = args.attachment.data.api.origin
    this.data.api.update('attachment', this.attachmentUpdate.bind(this))
    this.attachmentUpdate()
  }

  // 线条变化得时候要更新点位
  attachmentUpdate() {
    let point = getLinePoint(this.data.attachment, this.data)

    // 如果不在当前依附萧条中
    if (!isContainPoint(this.data.attachment, point)) {
      let dis1 = lineDis([this.data.attachment[0], this.data])
      let dis2 = lineDis([this.data.attachment[1], this.data])

      point = dis1 < dis2 ? this.data.attachment[0] : this.data.attachment[1]
    }

    this.data.x = point.x
    this.data.y = point.y
  }

  // 设置新得附属
  setAttachment(attachment) {
    if (attachment !== this.data.attachment) {
      this.data.attachment = attachment
      this.attachmentUpdate()
    }
  }

  dragMove(move) {
    let newPoint = getLinePoint(
      this.data.attachment, 
      {
        x: this.cachePos.x + move.x,
        y: this.cachePos.y + move.y
      }
    )

    if (isContainPoint(this.data.attachment, newPoint)) {
      this.data.x = newPoint.x
      this.data.y = newPoint.y
      return true
    } else {
      return false
    }
  }

  
  
  intercept() {
    
  }
}


export default LimitLine
