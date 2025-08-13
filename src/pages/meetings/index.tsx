import styles from "./index.module.css";
import { type NextPage } from "next";
import { Fragment, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  Box,
  Button,
  Card,
  Chip,
  Group,
  InputBase,
  Rating,
  Switch
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import Layout from "~/components/layout/layout";
import { type Participant } from "~/types/member";
import { api, type RouterInputs } from "~/utils/api";
import BookCard from "~/components/book-card/book-card";
import { AuthContext, UserAuth } from "~/context/auth-context";

const schema = z.object({
  title: z.string().min(1, { message: "Title should have at least 1 letters" }),
  author: z
    .string()
    .min(2, { message: "Author name should have at least 2 letters" }),
  date: z.date({
    required_error: "Please select a meeting date",
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

const MeetingsPage: NextPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const { isAuth } = UserAuth();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: "",
      author: "",
      date: new Date(),
      cover: "",
      chosenById: "",
      isComplete: false,
      participants: [] as Participant[]
    }
  });

  const utils = api.useContext();
  const createMeetingMutation = api.meetings.create.useMutation({
    onSuccess: () => {
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.meetings.getAll.invalidate();
      setOpenForm(false);
    }
  });

  const { data: meetings } = api.meetings.getAll.useQuery();

  const { data: actualMembers } = api.members.getActiveMembersByDate.useQuery(
    {
      date: form.values.date
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          form.setFieldValue(
            "participants",
            data.map((member) => ({
              // ...member,
              id: member.id,
              isVisited: false,
              rating: null
            }))
          );
        }
      }
    }
  );

  const meetingsReverse = meetings ? [...meetings].reverse() : [];

  const fieldsMembers = form.values.participants.map((member, index) => (
    <Group position="apart" mb="12px" key={member.id}>
      <Switch
        mr="12px"
        label={`${
          actualMembers?.find((person) => person.id === member.id)
            ?.firstName as string
        }`}
        {...form.getInputProps(`participants.${index}.isVisited`, {
          type: "checkbox"
        })}
      />

      <Rating
        defaultValue={0}
        {...form.getInputProps(`participants.${index}.rating`)}
      />
    </Group>
  ));

  return (
    <Layout>
      <main className={styles.meetingsPage}>
        {isAuth && (
          <Box className={styles.formWrapper}>
            {openForm ? (
              <>
                <Box w="50%">
                  <Card mr="12px" shadow="xl" padding="40px">
                    <form
                      onSubmit={form.onSubmit((values) => {
                        const { chosenById, ...requestData } = values;
                        const request: RouterInputs["meetings"]["create"] = {
                          ...requestData
                        };
                        if (chosenById) {
                          request.chosenById = Number(chosenById);
                        }

                        createMeetingMutation.mutate(request);
                        // console.log(request)
                      })}
                    >
                      <InputBase
                        label="Book title"
                        placeholder="Book title"
                        mb="24px"
                        {...form.getInputProps("title")}
                      />
                      <InputBase
                        label="Author"
                        placeholder="Author"
                        mb="24px"
                        {...form.getInputProps("author")}
                      />
                      <InputBase
                        label="Who choosed book"
                        component="select"
                        mb="24px"
                        {...form.getInputProps("chosenById")}
                      >
                        <option value={""}></option>
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
                        {...form.getInputProps("date")}
                      />

                      <Chip
                        checked={form.values.isComplete}
                        mb="24px"
                        {...form.getInputProps("isComplete")}
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
        )}

        <Box className={styles.meetingsList}>
          {meetingsReverse.map((meeting) => {
            return <BookCard meeting={meeting} key={meeting.id}></BookCard>;
          })}
        </Box>
      </main>
    </Layout>
  );
};

export default MeetingsPage;
