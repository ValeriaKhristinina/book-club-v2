import styles from "./index.module.css";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../utils/api";
import {
  Card,
  Text,
  Title,
  Container,
  Group,
  Image,
  List,
  Loader
} from "@mantine/core";
import Link from "next/link";
import { type Member } from "~/types/member";
import { type Meeting } from "~/types/meeting";
import { type NextMeeting } from "~/types/meeting";
import Layout from "~/components/layout/layout";
import BookCard from "../components/book-card/book-card";
import { BOOK_CLUB_BIRTHDAY, EMPTY_MEMBER } from "~/const";
import { checkVisitingParticipants, createQueue } from "~/utils/utils";

const Home: NextPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [nextMeeting, setNextMeeting] = useState<NextMeeting>();
  const [closedMeetings, setClosedMeetings] = useState<Meeting[]>();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const { data: actualMembers, isSuccess: actualMembersFetched } =
    api.members.getActiveMembersByDate.useQuery({
      date: now
    });
  const { data: closedMeetingsQuery, isSuccess: closedMeetingsFetched } =
    api.meetings.getClosedMeetings.useQuery();
  const { data: meetingNext } = api.meetings.getNextMeeting.useQuery();
  const lastThreeMeetings = closedMeetings
    ? closedMeetings?.slice(-3).reverse()
    : [];

  useEffect(() => {
    if (actualMembers) {
      setMembers(actualMembers);
    }
    if (meetingNext) {
      setNextMeeting(meetingNext);
    }
    if (closedMeetingsQuery) {
      setClosedMeetings(closedMeetingsQuery);
    }
  }, [actualMembers, meetingNext, closedMeetingsQuery]);

  //Calc bookclub's "age"
  const differenceInMonths = dayjs(now).diff(BOOK_CLUB_BIRTHDAY, "month");
  const years = Math.floor(differenceInMonths / 12);
  const months = differenceInMonths - years * 12;

  const reversedClosedMeetings = closedMeetings
    ? [...closedMeetings].reverse()
    : [];
  const lastFourClosedMeetings = reversedClosedMeetings.slice(0, 4);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const lastChoosedMember = nextMeeting?.chosenBy;

  const visitingStructure = checkVisitingParticipants(lastFourClosedMeetings);
  const newQueue = createQueue(
    members,
    lastChoosedMember as Member,
    visitingStructure
  );

  return (
    <Container className={styles.appContainer}>
      <Layout>
        {!actualMembersFetched && !closedMeetingsFetched ? (
          <main className={styles.loadeContainer}>
            <Loader color="blue" />
          </main>
        ) : (
          <main className={styles.main}>
            <Group position="apart" mb="40px">
              <Card w="160px" radius="xl" shadow="lg">
                <Text size="sm" align="center">
                  {years} years {months} month
                </Text>
              </Card>
              <Card w="160px" radius="xl" shadow="lg">
                <Text size="sm" align="center">
                  {actualMembers?.length} members
                </Text>
              </Card>
              <Card w="160px" radius="xl" shadow="lg">
                <Text size="sm" align="center">
                  {closedMeetings?.length} meetings
                </Text>
              </Card>
            </Group>

            <Container className={styles.choosingSection} p="0">
              <Group className={styles.choosingGroup}>
                <Title className={styles.title} size="sm">
                  Next Meeting:
                </Title>
                <Card shadow="xl" className={styles.nextChoosed}>
                  <Group className={styles.nextMeetingCover}>
                    <Image src="/book-image.png" alt="next meeting cover" />
                  </Group>

                  <Group className={styles.nextMeetingInfo}>
                    <Text mb="30px" size="sm">
                      {nextMeeting?.title}
                    </Text>
                    {nextMeeting?.chosenById !== null ? (
                      <Text mb="30px" size="sm">
                        Choosen by:{" "}
                        <Link href={`/member/`}>
                          {nextMeeting?.chosenBy?.firstName}{" "}
                          {nextMeeting?.chosenBy?.lastName}{" "}
                        </Link>
                      </Text>
                    ) : (
                      <Text mb="40px" size="sm">
                        Nobody choosed
                      </Text>
                    )}

                    <Text size="sm">
                      See you {dayjs(nextMeeting?.date).format("D MMM YYYY")}
                    </Text>
                  </Group>
                </Card>
              </Group>
              <Group className={styles.choosingGroup}>
                <Title className={styles.title}>Next Chosing Member:</Title>
                <Card shadow="xl" className={styles.nextChoosed}>
                  <List className={styles.members}>
                    {newQueue.slice(0, 5).map((member, index) => {
                      return (
                        <List.Item className={styles.firstMeber} key={index}>
                          <Link href={`/member/${member.id}`}>
                            {member.firstName} {member.lastName}
                          </Link>
                        </List.Item>
                      );
                    })}
                    <List.Item>
                      <Link href="/members">...</Link>
                    </List.Item>
                  </List>
                </Card>
              </Group>
            </Container>

            <Container p="0">
              <Title className={styles.title} size="sm">
                Last Three Meetings
              </Title>
              <Group position="apart">
                {lastThreeMeetings.map((meeting) => {
                  return (
                    <BookCard meeting={meeting} key={meeting.id}></BookCard>
                  );
                })}
              </Group>
              <Link href="/meetings">See all past meetings...</Link>
            </Container>
          </main>
        )}
      </Layout>
    </Container>
  );
};

export default Home;
