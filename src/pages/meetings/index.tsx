import styles from './index.module.css';
import { type NextPage } from 'next';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  Chip,
  Group,
  InputBase,
  Rating,
  Switch
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import Layout from '~/components/layout/layout';
import { useState } from 'react';
import { api, type RouterOutputs, type RouterInputs } from '~/utils/api';

const schema = z.object({
  title: z.string().min(1, { message: 'Title should have at least 1 letters' }),
  author: z
    .string()
    .min(2, { message: 'Author name should have at least 2 letters' }),
  date: z.date({
    required_error: 'Please select a meeting date',
    invalid_type_error: "That's not a date!"
  }),
  cover: z.string().optional(),
  chosenById: z.string().optional(),
  // participants: z.array(z.object({
  //   id: z.string()
  // })),
  isComplete: z.boolean()
});

type ParticipantsResponse = RouterOutputs['members']['getActiveMembersByDate'];
type Participant = {
  isVisited: boolean;
  rating: null | number;
} & ParticipantsResponse[0];

const MeetingsPage: NextPage = () => {
  const [openForm, setOpenForm] = useState(false);

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: '',
      author: '',
      date: new Date(),
      cover: '',
      chosenById: '',
      isComplete: false,
      participants: [] as Participant[]
    }
  });

  const { data: meetings } = api.meetings.getAll.useQuery();
  //  const { data: members } = api.members.getAll.useQuery();

  const { data: actualMembers } = api.members.getActiveMembersByDate.useQuery(
    {
      date: form.values.date
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          form.setFieldValue(
            'participants',
            data.map((member) => ({
              ...member,
              isVisited: false,
              rating: null
            }))
          );
        }
      }
    }
  );

  const fieldsMembers = form.values.participants.map(
    (member: Participant, index) => (
      <Group position="apart" mb="12px" key={member.id}>
        <Switch
          mr="12px"
          label={`${member.firstName} ${member.lastName}`}
          {...form.getInputProps(`participants.${index}.isVisited`, {
            type: 'checkbox'
          })}
        />

        <Rating
          defaultValue={0}
          {...form.getInputProps(`participants.${index}.rating`)}
        />
      </Group>
    )
  );

  return (
    <Layout>
      <main className={styles.meetingsPage}>
        <Box className={styles.formWrapper}>
          {openForm ? (
            <>
              <Box w="50%">
                <Card mr="12px" shadow="xl" padding="40px">
                  <form
                    onSubmit={form.onSubmit((values) => {
                      const {chosenById, ...requestData} = values
                      const request: RouterInputs['meetings']['create'] = {...requestData}
                      if(chosenById) {
                        request.chosenById = Number(chosenById);
                      }

                      console.log(request);
                    })}
                  >
                    <InputBase
                      label="Book title"
                      placeholder="Book title"
                      mb="24px"
                      {...form.getInputProps('title')}
                    />
                    <InputBase
                      label="Author"
                      placeholder="Author"
                      mb="24px"
                      {...form.getInputProps('author')}
                    />
                    <InputBase
                      label="Who choosed book"
                      component="select"
                      mb="24px"
                      {...form.getInputProps('chosenById')}
                    >
                      <option value={''}></option>
                      {actualMembers?.map((member) => {
                        return (
                          <option key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </option>
                        );
                      })}
                    </InputBase>
                    <DateInput
                      valueFormat="DD MMMM YYYY"
                      label="Meeting Date"
                      placeholder="meeting date"
                      mb="24px"
                      {...form.getInputProps('date')}
                    />

                    <Chip
                      checked={form.values.isComplete}
                      mb="24px"
                      {...form.getInputProps('isComplete')}
                    >
                      Closed meeting
                    </Chip>

                    <Group position="apart">
                      <Button
                        type="submit"
                        // disabled={createMemberMutation.isLoading}
                        // loading={createMemberMutation.isLoading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => setOpenForm(false)}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </form>
                </Card>
              </Box>
              {form.values.isComplete && (
                <Box w="50%">
                  <Card shadow="xl" padding="40px">
                    {fieldsMembers}
                  </Card>
                </Box>
              )}
            </>
          ) : (
            <Button onClick={() => setOpenForm(true)} mb="32px">
              Create new meeting
            </Button>
          )}
        </Box>
        <Box>
          {meetings?.map((meeting) => {
            return (
              <Card key={meeting.id}>
                <p>{meeting.title}</p>
                <p>{meeting.author}</p>
              </Card>
            );
          })}
        </Box>
      </main>
    </Layout>
  );
};

export default MeetingsPage;
