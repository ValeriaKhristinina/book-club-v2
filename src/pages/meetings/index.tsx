import { Button, Card, Chip, InputBase } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import styles from './index.module.css';
import { type NextPage } from 'next';
import Layout from '~/components/layout/layout';

const MeetingsPage: NextPage = () => {
  return (
    <Layout>
      <main className={styles.meetingsPage}>
        <Button mb="32px">Create new meeting</Button>

        <Card w="500px" shadow="xl" padding="40px">
          <form action="">
            <InputBase label="Book title" placeholder="Book title" mb="24px" />
            <InputBase label="Author" placeholder="Author" mb="24px" />
            <InputBase label="Who choosed book" component="select" mb="24px">
              <option value="1">Lera</option>
              <option value="4">Nikita</option>
              <option value="7">Nastia</option>
            </InputBase>
            <DateInput
              valueFormat="DD MMMM YYYY"
              label="Date input"
              placeholder="Date input"
              mb="24px"
            />

            <Chip mb="24px">Closed meeting</Chip>

            

            
          </form>
        </Card>
      </main>
    </Layout>
  );
};

export default MeetingsPage;
