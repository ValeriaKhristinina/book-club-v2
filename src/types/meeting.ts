import {type RouterOutputs} from '../utils/api'

export type Meetings = RouterOutputs["meetings"]["getAll"]
export type Meeting = Meetings["0"]