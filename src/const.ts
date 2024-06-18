import { Meeting } from "./types/meeting";
import { type Member } from "./types/member";

export const BOOK_CLUB_BIRTHDAY = '2020/10/5'

export enum ProgressColor {
  Red = 'red',
  Yellow = 'yellow',
  Green = 'green'
}

export const EMPTY_MEMBER: Member = {
  created_at: new Date(),
  chosenMeetings: [
    {
      created_at: new Date(),
      author: 'book_author',
      chosenById: 0,
      cover: null,
      date: new Date(),
      id: 0,
      isComplete: true,
      title: 'book_title'
    }
  ],
  exitDate: null,
  firstName: 'Member_name',
  id: 0,
  joinDate: new Date(),
  lastName: 'member_surname',
  meetings: [
    {
      meetingId: 0,
      participantId: 0,
      rating: null,
      isVisited: true
    }
  ]
};

export const EMPTY_MEETING: Meeting = {
  id: 0,
  created_at: new Date(),
  date: new Date(),
  title: "book_title",
  author: "book_author",
  cover: null,
  chosenById: 0,
  isComplete: true,
  participants: [
      {
          meetingId: 0,
          participantId: 0,
          rating: null,
          isVisited: true,
          participant: {
              id: 0,
              created_at: new Date(),
              firstName: "first_name",
              lastName: "last_name",
              joinDate: new Date(),
              exitDate: null
          }
      }
  ],
  chosenBy: {
    id: 0,
    created_at: new Date(),
    firstName: "first_name",
    lastName: "last_name",
    joinDate: new Date(),
    exitDate: null
  }
}