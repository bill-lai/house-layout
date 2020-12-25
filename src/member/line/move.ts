import FixedLine from './fixed'
import {FixedLineData} from '../../constant/type'

class MoveLine extends FixedLine {
  cacheLine: FixedLineData

  constructor(args) {
    super(args)
  }

  dragStart() {
    this.cacheLine = this.data.map(item => ({...item})) as FixedLineData
  }

  dragMove(move) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].x = this.cacheLine[i].x + move.x
      this.data[i].y = this.cacheLine[i].y + move.y
    }
  }

  dragEnd() {
    delete this.cacheLine
  }
}


export default MoveLine
