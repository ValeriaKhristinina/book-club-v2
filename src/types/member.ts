
import {type RouterOutputs } from '~/utils/api';
export type MembersResponse = RouterOutputs['members']['getActiveMembersByDate'];
export type Member =  MembersResponse[0];


export type Participant = {
  id: number,
  isVisited: boolean;
  rating: null | number;
}
// export type MeetinInput = RouterInputs["members"]['getActiveMembersByDate']
// export type MemberInput = MeetinInput[0]