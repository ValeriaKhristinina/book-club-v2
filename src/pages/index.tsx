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
import { useEffect, useState } from 'react';
import { Meeting, Member } from '@prisma/client';

const Home: NextPage = () => {
  const [lastChoosedMemberId, setLastChoosedMemberId] = useState(0)
  const [members, setMembers] = useState<Member[]>([])
  const [nextMeeting, setNextMeeting] = useState<Meeting>()
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const {data: actualMembers} = api.members.getActiveMembersByDate.useQuery({
    date: now
  });
  const {data: closedMeetings} = api.meetings.getClosedMeetings.useQuery();
  const {data: meetingNext} = api.meetings.getNextMeeting.useQuery();
  const lastThreeMeetings = closedMeetings?  closedMeetings?.slice(-3).reverse() : []

  useEffect(()=>{
    if(actualMembers) {
      setMembers(actualMembers)
    }
    if(meetingNext) {
      setNextMeeting(meetingNext)
    }
  }, [actualMembers, meetingNext])

  //Calc bookclub's "age"
  const differenceInMonths = dayjs(now).diff(BOOK_CLUB_BIRTHDAY, 'month');
  const years = Math.floor(differenceInMonths / 12);
  const months = differenceInMonths - years * 12;





  // find last member who choose book
  // const indexChoosingPerson = members.findIndex(meetingNext?.chosenBy);

  const reversedClosedMeetings = closedMeetings ?  [...closedMeetings].reverse() : []

  const lastChoosedMember = reversedClosedMeetings.find(meeting => meeting.chosenById != null)?.chosenBy


  console.log(lastChoosedMember)
  const lastChoosedMemberIndex = members.findIndex(member => member.id === lastChoosedMember?.id)
  console.log(lastChoosedMemberIndex)


  if (lastChoosedMemberIndex) {
    const firstCutArray = members ?  members.slice(lastChoosedMemberIndex + 1) : []
    const secondCutArray = members.slice(0, lastChoosedMemberIndex)
    const newArr = firstCutArray.concat(secondCutArray)
    console.log(newArr)
  }
  
  
  
  
  
  // console.log(newArr)

  return (
    <Container className={styles.app}>
      <Layout>
        <main className={styles.main}>
          <Group position="apart" mb="40px">
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">
                {years} years {months} month
              </Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">{actualMembers?.length} members</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text align="center">{closedMeetings?.length} meetings</Text>
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
                    {nextMeeting?.title}
                  </Text>
                  {nextMeeting?.chosenById !== null ? (
                    <Text mb="40px" size="sm">
                      Choosen by: <Link href={`/member/`}>{nextMeeting?.chosenBy?.firstName} {nextMeeting?.chosenBy?.lastName} </Link>
                    </Text>
                  ) : (
                    <Text mb="40px" size="sm">
                      Nobody choosed
                    </Text>
                  )}

                  <Text size="sm">See you {dayjs(nextMeeting?.date).format('D MMM YYYY')}</Text>
                </Group>
              </Card>
            </Group>
            <Group className={styles.choosingGroup}>
              <Title className={styles.title}>Next Chosing Member:</Title>
              <Card shadow="xl" className={styles.nextChoosed}>
                <List className={styles.members}>
                  {actualMembers?.map((member, index) => {
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
            <Group position="apart">
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
