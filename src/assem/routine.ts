import LineAssem from './lineon'
import {RoutineAssemData, RoutineAssemProp} from '../constant/type'
import { Interact } from 'data-interact'

abstract class Routine extends LineAssem {
  data: Interact<RoutineAssemData>

  constructor(args: RoutineAssemProp) {
    super(args)
  }

  
}

export default Routine