import React from 'react';
import styles from './book-card.module.css';
import dayjs from 'dayjs';
import { api } from '~/utils/api';
import { type Meeting } from '~/types/meeting';
import {
  Card,
  Group,
  Rating,
  Text,
  Image,
  Title,
  Avatar,
  Container,
  Progress
} from '@mantine/core';
import {
  calculateAverageRating,
  checkProgressColor,
  getRatedParticipants,
  getVisitedParticipants,
  getVisitingProgress
} from '~/utils/utils';

interface BookCardProps {
  meeting: Meeting;
}

function BookCard({ meeting }: BookCardProps) {
  if (!meeting) {
    return (
      <Card>
        <Title>No meeting</Title>
      </Card>
    );
  }
  const actualMembersQuery = api.members.getActiveMembersByDate.useQuery({
    date: meeting.date
  });

  const actualMembers = actualMembersQuery.data ? actualMembersQuery.data : []



  const { data: choosedMember } = api.members.getById.useQuery({
    id: meeting.chosenById || 0
  });

  const averageRating = calculateAverageRating(meeting);
  const visitedParticipants = getVisitedParticipants(actualMembers, meeting);
  const ratedParticipants = getRatedParticipants(actualMembers, meeting);
  const visitingProgress = getVisitingProgress(
    visitedParticipants.length,
    actualMembers.length
  );

  return (
    <Card w="250px" shadow="xl" padding="12px" className={styles.bookCard}>
      <Group position="apart" mb="12px">
        <Group>
          <Rating fractions={16} defaultValue={averageRating} readOnly />
          <Text>({averageRating})</Text>
        </Group>
        <Text>
          {ratedParticipants.length}/{actualMembers.length}
        </Text>
      </Group>
      <Group position="center" mb="12px">
        <Image
          className={styles.center}
          src="https://picsum.photos/150/220"
          width="150px"
          alt="rando photo"
        />
      </Group>
      <Title size="md" align="center" mb="12px">
        {meeting.title} by {meeting.author}
      </Title>
      <Group position="apart" mb="12px">
        <Avatar color="cyan" radius="xl">
          {choosedMember?.firstName.charAt(0)}
          {choosedMember?.lastName.charAt(0)}
        </Avatar>
        <Text>{dayjs(meeting.date).format('D MMM YYYY')}</Text>
      </Group>

      <Container p="0px">
        <Progress
          value={visitingProgress}
          label={`${visitingProgress}%`}
          size="xl"
          radius="xl"
          color={checkProgressColor(visitingProgress)}
        />
        <Group position="apart">
          <Text>
            {visitedParticipants.length}/{actualMembers.length}
          </Text>
          <Text>{visitingProgress}%</Text>
        </Group>
      </Container>
    </Card>
  );
}

export default BookCard;
