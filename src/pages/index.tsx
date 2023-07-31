import styles from './index.module.css';
import { type NextPage } from 'next';
import dayjs from 'dayjs';
import { api } from '../utils/api';
import {
  Card,
  Text,
  Title,
  Container,
  Group,
  Image,
  List
} from '@mantine/core';
import Link from 'next/link';
import Layout from '~/components/layout/layout';
import BookCard from '../components/book-card/book-card';
import { BOOK_CLUB_BIRTHDAY } from '~/const';

const Home: NextPage = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const actualMembersQuery = api.members.getActiveMembersByDate.useQuery({
    date: now
  });
  const actualMembers = actualMembersQuery.data ? actualMembersQuery.data : [];
  const closedMeetingQuery = api.meetings.getClosedMeetings.useQuery()
  const closedMeetings =  closedMeetingQuery.data ? closedMeetingQuery.data : []

  //Calc bookclub's "age"
  const differenceInMonths = dayjs(now).diff(BOOK_CLUB_BIRTHDAY, 'month');
  const years = Math.floor(differenceInMonths / 12);
  const months = differenceInMonths - (years * 12)
  const lastThreeMeetings = closedMeetings.slice(-3).reverse()

  return (
    <Container className={styles.app}>
      <Layout>
        <main className={styles.main}>
          <Group position="apart" mb="40px">
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">{years} years {months} month</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">{actualMembers.length} members</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">{closedMeetings.length} meetings</Text>
            </Card>
          </Group>

          <Container className={styles.choosingSection} p="0">
            <Group className={styles.choosingGroup}>
              <Title className={styles.title} size="sm">
                Next Meeting:
              </Title>
              <Card shadow="xl" className={styles.nextChoosed}>
                <Group className={styles.nextMeetingCover}>
                  <Image
                    src="https://picsum.photos/150/220"
                    alt="next meeting cover"
                  />
                </Group>

                <Group className={styles.nextMeetingInfo}>
                  <Text mb="40px" size="sm">
                    Name book
                  </Text>
                  <Text mb="40px" size="sm">
                    Choosen by: <Link href="/">Lera Khristinina</Link>
                  </Text>
                  <Text size="sm">See you DD month YYYY</Text>
                </Group>
              </Card>
            </Group>
            <Group className={styles.choosingGroup}>
              <Title className={styles.title}>Next Chosing Member:</Title>
              <Card shadow="xl" className={styles.nextChoosed}>
                <List className={styles.members}>
                  {actualMembers.map((member, index) => {
                    return (
                      <List.Item className={styles.firstMeber} key={index}>
                        <Link href="/">
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
            <Group mb="40px" position="apart">
              {lastThreeMeetings.map((meeting) => {
                return <BookCard meeting={meeting} key={meeting.id}></BookCard>;
              })}
            </Group>
            <Link href="/meetings">See all past meetings...</Link>
          </Container>
        </main>
      </Layout>
    </Container>
  );
};

export default Home;
