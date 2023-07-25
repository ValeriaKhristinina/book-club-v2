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
import { calculateAverageRating } from '~/utils/utils';

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
  const memberQuery = api.members.getById.useQuery({
    id: meeting.chosenById || 0
  });
  const choosedMember = memberQuery.data;

  const averageRating = calculateAverageRating(meeting);

  return (
    <Card w="250px" shadow="xl" padding="12px">
      <Group position="apart" mb="12px">
        <Group>
          <Rating fractions={4} defaultValue={averageRating} readOnly/>
          <Text>({averageRating})</Text>
        </Group>
        <Text>3/8</Text>
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
        <Progress value={75} label="75%" size="xl" radius="xl" />
        <Group position="apart">
          <Text>4/8</Text>
          <Text>50%</Text>
        </Group>
      </Container>
    </Card>
  );
}

export default BookCard;
