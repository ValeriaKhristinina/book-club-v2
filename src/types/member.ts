
import { type RouterOutputs } from '~/utils/api';
export type MembersResponse = RouterOutputs['members']['getActiveMembersByDate'];

export type Member = MembersResponse[0];