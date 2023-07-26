import { type Meeting } from "~/types/meeting";
import { type Member } from "~/types/member";


export const calculateAverageRating = (book: Meeting) => {
  if (!book.participants) {
    return 0
  }
  const votingPersons = book.participants.filter(person => person.rating !== null)
  const result = votingPersons.reduce((sum, current) => sum + (current.rating || 0), 0);
  const averageValue = Math.round((result / votingPersons.length) * 100) / 100
  return averageValue
}

export const getVisitedParticipants = (members: Member[], meeting: Meeting) => {
  return members.filter((member)=> member.meetings.find(singleMeeting => singleMeeting.meetingId === meeting.id)?.isVisited)
}

export const getRatedParticipants = (members: Member[], meeting: Meeting) => {
  return members.filter((member)=> member.meetings.find(singleMeeting => singleMeeting.meetingId === meeting.id) && member.meetings.find(singleMeeting => singleMeeting.meetingId === meeting.id)?.rating !== null )
}


export const getVisitingProgress = (visitingPersons: number, allPersons: number): number => Math.round(((10 * visitingPersons) / allPersons) * 10)