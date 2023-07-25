import { type Meeting } from "~/types/meeting";


export const calculateAverageRating = (book: Meeting) => {
  if (!book.participants) {
    return 0
  }
  const votingPersons = book.participants.filter(person => person.rating !== null)
  const result = votingPersons.reduce((sum, current) => sum + (current.rating || 0), 0);
  const averageValue = Math.round((result / votingPersons.length) * 100) / 100
  return averageValue
}