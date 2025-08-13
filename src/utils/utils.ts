import { ProgressColor } from "~/const";
import { type Meeting } from "~/types/meeting";
import { type Member } from "~/types/member";

export const calculateAverageRating = (book: Meeting) => {
  if (!book.participants) {
    return 0;
  }
  const votingPersons = book.participants.filter(
    (person) => person.rating !== null
  );
  const result = votingPersons.reduce(
    (sum, current) => sum + (current.rating || 0),
    0
  );
  const averageValue = Math.round((result / votingPersons.length) * 100) / 100;
  return averageValue;
};

export const getVisitedParticipants = (members: Member[], meeting: Meeting) => {
  return members.filter(
    (member) =>
      member.meetings.find(
        (singleMeeting) => singleMeeting.meetingId === meeting.id
      )?.isVisited
  );
};

export const getRatedParticipants = (members: Member[], meeting: Meeting) => {
  return members.filter(
    (member) =>
      member.meetings.find(
        (singleMeeting) => singleMeeting.meetingId === meeting.id
      ) &&
      member.meetings.find(
        (singleMeeting) => singleMeeting.meetingId === meeting.id
      )?.rating !== null
  );
};

export const getVisitingProgress = (
  visitingPersons: number,
  allPersons: number
): number => Math.round(((10 * visitingPersons) / allPersons) * 10);

export const checkProgressColor = (progress: number): string => {
  if (progress <= 30) {
    return ProgressColor.Red;
  } else if (progress > 30 && progress <= 60) {
    return ProgressColor.Yellow;
  } else if (progress > 60 && progress <= 100) {
    return ProgressColor.Green;
  } else {
    return "invalid percentage";
  }
};
type VisitingStructure = {
  [key: number]: number;
};
export const checkVisitingParticipants = (
  meetings: Meeting[]
): VisitingStructure => {
  const newObj: VisitingStructure = {};

  meetings.map((item) => {
    if (!item.participants) {
      return false;
    }
    item.participants.map((person) => {
      if (!person.isVisited) {
        return false;
      }
      if (typeof newObj[person.participantId] !== "undefined") {
        newObj[person.participantId] += 1;
      } else {
        newObj[person.participantId] = 1;
      }
      return true;
    });
    return true;
  });
  return newObj;
};

export const createQueue = (
  members: Member[],
  lastChoosedMember: Member,
  visitingParticipants: VisitingStructure
) => {
  let newQueue: Member[] = [];
  const lastChoosedMemberIndex = members.findIndex(
    (member) => member.id === lastChoosedMember?.id
  );

  if (lastChoosedMemberIndex !== -1) {
    const firstCutArray = members.slice(lastChoosedMemberIndex + 1);
    const secondCutArray = members.slice(0, lastChoosedMemberIndex + 1);
    const newArr = firstCutArray.concat(secondCutArray);

    newQueue = newArr.filter((participant) => {
      const visits = visitingParticipants[participant.id];
      return visits !== undefined && visits >= 2;
    });
  }

  return newQueue;
};
