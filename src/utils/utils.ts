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

  meetings.forEach((item) => {
    if (!item.participants) return;

    item.participants.forEach((person) => {
      if (!person.isVisited) return;

      newObj[person.participantId] = (newObj[person.participantId] ?? 0) + 1;
    });
  });

  return newObj;
};

export const createQueue = (
  members: Member[],
  lastChoosedMember: Member,
  visitingParticipants: VisitingStructure
) => {
  if (!lastChoosedMember) return [];

  const pivotId = lastChoosedMember.id;

  // rotate queue so it starts AFTER the chosen id
  const pivotIndex = members.findIndex((m) => m.id === pivotId);
  if (pivotIndex === -1) return [];

  const rotated = [
    ...members.slice(pivotIndex + 1),
    ...members.slice(0, pivotIndex + 1)
  ];

  // filter by visiting rules
  rotated.filter((member) => {
    const visits = visitingParticipants[member.id];
    return visits !== undefined && visits >= 2;
  });

  console.log(rotated);

  return rotated;
};
