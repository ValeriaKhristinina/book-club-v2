import styles from './index.module.css';
import { type NextPage } from 'next';
import { api } from '../../utils/api';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import {
  Button,
  Card,
  Chip,
  Container,
  Group,
  InputBase,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import Layout from '~/components/layout/layout';
import { useState } from 'react';
import { MembersTable } from '~/components/members-table/members-table';

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Name should have at least 2 letters' }),
  lastName: z
    .string()
    .min(2, { message: 'Name should have at least 2 letters' }),
  joinDate: z.date({
    required_error: 'Please select a join date',
    invalid_type_error: "That's not a date!"
  }),
  exitDate: z.union([
    z.date({
      required_error: 'Please select a exit date',
      invalid_type_error: "That's not a date!"
    }),
    z.null()
  ])
});

const MembersPage: NextPage = () => {
  const [exitCheked, setExitChecked] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const utils = api.useContext();

  const createMemberMutation = api.members.create.useMutation({
    onSuccess: () => {
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.members.getAll.invalidate();
      setOpenForm(false);
    }
  });

  const { data: members } = api.members.getAll.useQuery();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      firstName: '',
      lastName: '',
      joinDate: new Date(),
      exitDate: null
    }
  });

  return (
    <Layout>
      <main className={styles.membersPage}>
        <Group>
          {!openForm ? (
            <Button onClick={() => setOpenForm(true)} mb="32px">
              Create new member
            </Button>
          ) : (
            <Card w="500px" shadow="xl" padding="80px 60px" mb="60px">
              <form
                onSubmit={form.onSubmit((values) => {
                  createMemberMutation.mutate(values);
                })}
              >
                <Title order={3} mb="24px">Add new member</Title>
                <InputBase
                  label="First name"
                  placeholder="First name"
                  mb="24px"
                  {...form.getInputProps('firstName')}
                />
                <InputBase
                  label="Last name"
                  placeholder="Last name"
                  mb="24px"
                  {...form.getInputProps('lastName')}
                />

                <DateInput
                  valueFormat="DD MMMM YYYY"
                  label="Join date"
                  placeholder="Join date"
                  mb="24px"
                  {...form.getInputProps('joinDate')}
                />
                <Chip
                  checked={exitCheked}
                  onChange={() => setExitChecked(!exitCheked)}
                  mb="18px"
                >
                  Close membership
                </Chip>
                {exitCheked && (
                  <DateInput
                    valueFormat="DD MMMM YYYY"
                    label="Exit date"
                    placeholder="Exit date"
                    mb="24px"
                    {...form.getInputProps('exitDate')}
                  />
                )}
                <Group position="apart">
                  <Button
                    type="submit"
                    disabled={createMemberMutation.isLoading}
                    loading={createMemberMutation.isLoading}
                  >
                    Save
                  </Button>
                  <Button variant="default" onClick={() => setOpenForm(false)}>
                    Cancel
                  </Button>
                </Group>
              </form>
            </Card>
          )}
        </Group>
        <Container p="0">
          <MembersTable members={members} />
        </Container>
      </main>
    </Layout>
  );
};

export default MembersPage;
