import {type RouterOutputs} from '../utils/api'

export type Meetings = RouterOutputs["meetings"]["getClosedMeetings"]
export type Meeting = Meetings["0"]