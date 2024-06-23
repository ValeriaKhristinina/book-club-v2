import React, { useState, useEffect } from "react";
import styles from "./book-card.module.css";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { type Meeting } from "~/types/meeting";
import { Pencil } from "tabler-icons-react";
import Link from "next/link";
import {
  Card,
  Group,
  Rating,
  Text,
  Image,
  Title,
  Avatar,
  Container,
  Progress,
  ActionIcon,
  Flex,
  Loader
} from "@mantine/core";
import {
  calculateAverageRating,
  checkProgressColor,
  getRatedParticipants,
  getVisitedParticipants,
  getVisitingProgress
} from "~/utils/utils";

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

  const actualMembers = actualMembersQuery.data ? actualMembersQuery.data : [];

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
  let isLoadingProgress = true;

  if (visitingProgress > 0 || !meeting.isComplete) {
    isLoadingProgress = false;
  }

   const progress = (meeting.isComplete && !isLoadingProgress) ? visitingProgress : 0;

  return (
    <Card w="220px" shadow="xl" padding="12px" className={styles.bookCard}>
      <Flex justify={"space-between"} mb="12px">
        <Group>
          <Rating fractions={16} defaultValue={averageRating} readOnly />
          <Text size="xs">({averageRating ? averageRating : 0})</Text>
          <Group className={styles.changeMeeting}>
            <Link href={`/meetings/${meeting.id}`}>
              <ActionIcon>
                <Pencil size="1.125rem" />
              </ActionIcon>
            </Link>
          </Group>
        </Group>
        <Text size="xs">
          {ratedParticipants.length}/{actualMembers.length}
        </Text>
      </Flex>
      <Flex justify={"center"} mb="12px">
        <Image
          className={styles.center}
          src="/book-image.png"
          width="120px"
          alt="rando photo"
        />
      </Flex>
      <Title size="md" mb="12px">
        {meeting.title} by {meeting.author}
      </Title>
      <Flex justify="space-between" mb="12px">
        <Avatar size="sm" radius="xl">
          {choosedMember?.firstName.charAt(0)}
          {choosedMember?.lastName.charAt(0)}
        </Avatar>
        <Text size="xs">{dayjs(meeting.date).format("D MMM YYYY")}</Text>
      </Flex>

      <Container p="0px">
        {isLoadingProgress && (
          <section>
            <Loader color="cyan" className={styles.loader} size="xs" />
          </section>
        )}

        <Progress
          value={progress}
          label={`${progress}%`}
          size="xl"
          radius="xl"
          color={checkProgressColor(progress)}
        />
        <Flex justify="space-between">
          <Text size="xs">
            {visitedParticipants.length}/{actualMembers.length}
          </Text>
          <Text size="xs">{progress}%</Text>
        </Flex>
      </Container>
    </Card>
  );
}

export default BookCard;
