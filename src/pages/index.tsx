import styles from './index.module.css';
import { type NextPage } from 'next';
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

import BookCard from '../components/book-card/book-card';
import Layout from '~/components/layout/layout';

const Home: NextPage = () => {
  const members = [
    { name: 'Nikita Khristinin' },
    { name: 'Marusia Urusova' },
    { name: 'Ania Tischenko' }
  ];

  const meetingsQuery = api.meetings.getAll.useQuery();
  const membersQuery = api.members.getAll.useQuery();

  console.log('meetingsQuery', meetingsQuery.data);
  console.log('membersQuery', membersQuery.data);

  return (
    <Container className={styles.app}>
      <Layout>
        <main className={styles.main}>
          <Group position="apart" mb="40px">
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">2 years 7 month</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">8 members</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">31 meetings</Text>
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
                  {members.map((member, index) => {
                    return (
                      <List.Item className={styles.firstMeber} key={index}>
                        <Link href="/">{member.name}</Link>
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
              <BookCard></BookCard>
              <BookCard></BookCard>
              <BookCard></BookCard>
            </Group>
            <Link href="/">See all past meetings...</Link>
          </Container>
        </main>
      </Layout>
    </Container>
  );
};

export default Home;
