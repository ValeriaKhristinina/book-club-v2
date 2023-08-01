import { ProgressColor } from "~/const";
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

export const checkProgressColor = (progress: number): string => {
  if (progress <= 30) {
    return ProgressColor.Red
  } else if (progress > 30 && progress <= 60) {
    return ProgressColor.Yellow
  } else if (progress > 60 && progress <= 100) {
    return ProgressColor.Green
  } else {
    return 'invalid percentage'
  }
}

export const createQueue = (closedMeetings: Meeting[]) => {
  //find last choosing member 
  const reversedClosedMeetings = [...closedMeetings].reverse()
  const findLastChoosedMemberId = reversedClosedMeetings.find(meeting => meeting.chosenById != null)?.chosenById
  console.log(findLastChoosedMemberId)

  // create array last 4 closed meetings 
  const lastFourMeetings = reversedClosedMeetings.slice(0,4)
  console.log(lastFourMeetings)

  return lastFourMeetings
}