import React from 'react';
import styles from './book-card.module.css'
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

function BookCard() {
  return (
    <Card w="250px" shadow="xl" padding="12px">
      <Group position="apart" mb="12px">
        <Rating defaultValue={4} />
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
        Book title by Author
      </Title>
      <Group position="apart" mb="12px">
        <Avatar color="cyan" radius="xl">
          LK
        </Avatar>
        <Text>18 May 2023</Text>
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
