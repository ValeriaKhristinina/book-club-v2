
import { type RouterOutputs } from '~/utils/api';
export type MembersResponse = RouterOutputs['members']['getActiveMembersByDate'];

export type Member = {
  isVisited: boolean;
  rating: null | number;
} & MembersResponse[0];