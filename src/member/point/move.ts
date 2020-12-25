import FixedPoint from './fixed'
import {point} from '../../constant/type'

class MovePoint extends FixedPoint {
  cachePos: point

  dragStart() {
    this.cachePos = {
      ...this.data.api.origin
    }
  }

  dragMove(move) {
    this.data.x = this.cachePos.x + move.x
    this.data.y = this.cachePos.y + move.y
  }

  dragEnd() {
    delete this.cachePos
  }
}


export default MovePoint
