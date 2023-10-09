import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import Layout from '~/components/layout/layout';
import { type Meeting } from '~/types/meeting';
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
import { api, type RouterInputs } from '~/utils/api';

const EditMeeting = ({ meeting }: { meeting: Meeting }) => {
  const schema = z.object({
    title: z
      .string()
      .min(1, { message: 'Title should have at least 1 letters' }),
    author: z
      .string()
      .min(2, { message: 'Author name should have at least 2 letters' }),
    date: z.date({
      required_error: 'Please select a meeting date',
      invalid_type_error: "That's not a date!"
    }),
    cover: z.string().optional(),
    chosenById: z.string().optional(),
    participants: z.array(
      z.object({
        id: z.number(),
        rating: z.union([z.number(), z.null()]),
        isVisited: z.boolean()
      })
    ),
    isComplete: z.boolean()
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: meeting.title,
      author: meeting.author,
      date: meeting.date,
      cover: meeting.cover,
      chosenById: meeting?.chosenById?.toString(),
      isComplete: meeting.isComplete,
      participants: meeting.participants.map((item) => ({
        id: item.participantId,
        rating: item.rating,
        isVisited: item.isVisited
      }))
    }
  });

  const { data: actualMembers } = api.members.getActiveMembersByDate.useQuery(
    {
      date: form.values.date
    },
    {
      refetchOnWindowFocus: false
    }
  );

  const utils = api.useContext();
  const updateMeetingMutation = api.meetings.update.useMutation({
    onSuccess: () => {

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
       utils.meetings.getById.invalidate();
    }
  });

  const fieldsMembers = actualMembers?.map((member, index) => {
    const participantIndex = form.values.participants.findIndex(
      (participant) => participant.id == member.id
    );
    return (
      <Group position="apart" mb="12px" key={member.id}>
        <Switch
          mr="12px"
          label={`${member.firstName}`}
          {...form.getInputProps(`participants.${participantIndex}.isVisited`, {
            type: 'checkbox'
          })}
        />

        <Rating
          defaultValue={0}
          {...form.getInputProps(`participants.${participantIndex}.rating`)}
        />
      </Group>
    );
  });

  return (
    <>
      <Box w="50%">
        <Card mr="12px" shadow="xl" padding="40px">
          <form
            onSubmit={form.onSubmit((values) => {
              const { chosenById, ...requestData } = values;
              const request: RouterInputs['meetings']['update'] = {
                ...requestData,
                id: meeting.id,
                cover: ''
              };
              if (chosenById) {
                request.chosenById = Number(chosenById);
              }
              updateMeetingMutation.mutate(request);
              // console.log(request)
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
              {updateMeetingMutation.isSuccess && 'Success!'}
              {updateMeetingMutation.isError && 'Error!'}
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
  );
};

const EditMeetingPage: NextPage = () => {
  const router = useRouter();
  const meetingId = router.query.id;

  const { data: meeting, isFetched } = api.meetings.getById.useQuery({
    id: Number(meetingId)
  });

  return (
    <Layout>
      <>
        <h1>Hello! {meeting?.id}</h1>

        {isFetched && <EditMeeting meeting={meeting} />}
      </>
    </Layout>
  );
};

export default EditMeetingPage;
