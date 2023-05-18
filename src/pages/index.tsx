import styles from './index.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import {
  Card,
  Image,
  Text,
  Title,
  Container,
  Avatar,
  Progress,
  Rating,
  Group,
  NavLink,
  Button
} from '@mantine/core';
import Link from 'next/link';
// import Link from "next/link";

// import { api } from '~/utils/api';

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <Head>
        <title>BookClub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Group position='apart' w="1024px">
          <Group>
            <Title size="sm">
              <Link href={'/'}>Book Club</Link>
            </Title>
          </Group>
          <Group>
            <Card w="160px" radius="xl" shadow="lg">
              <Text>2 years 7 month</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text>8 members</Text>
            </Card>
            <Card w="160px" radius="xl" shadow="lg">
              <Text>31 meetings</Text>
            </Card>
          </Group>
          <Group>
            <Button>Login</Button>
          </Group>
        </Group>
      </header>
      <main className={styles.main}>
        <Container className={styles.center}>
          <Card w="300px" shadow="lg" padding="xl">
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

            <Container>
              <Progress value={75} label="75%" size="xl" radius="xl" />
              <Group position="apart">
                <Text>4/8</Text>
                <Text>50%</Text>
              </Group>
            </Container>
          </Card>
        </Container>
      </main>
    </>
  );
};

export default Home;
