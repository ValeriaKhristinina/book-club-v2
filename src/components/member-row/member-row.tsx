import styles from "./member-row.module.css";
import { z } from "zod";
import { useDisclosure } from "@mantine/hooks";
import {
  Avatar,
  Group,
  Text,
  Badge,
  ActionIcon,
  Modal,
  InputBase,
  Checkbox,
  Button
} from "@mantine/core";
import { type Member } from "../../types/member";
import { Pencil } from "tabler-icons-react";
import { api } from "~/utils/api";
import { type Meeting } from "~/types/meeting";
import { useForm, zodResolver } from "@mantine/form";
import { EMPTY_MEETING } from "~/const";
import Link from "next/link";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { UserAuth } from "~/context/auth-context";

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name should have at least 1 letters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name should have at least 1 letters" }),
  exitDate: z
    .date({
      required_error: "Please select a exit date",
      invalid_type_error: "That's not a date!"
    })
    .optional()
    .nullable(),
  joinDate: z.date({
    required_error: "Please select a join date",
    invalid_type_error: "That's not a date!"
  })
});

const MemberRow = ({ member }: { member: Member }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [closeMembership, setCloseMembership] = useState(false);
  const { data: meetings } = api.meetings.getAll.useQuery();
  const { data: countLastFourVisiting } =
    api.members.getLastFourMonthVisiting.useQuery({
      memberId: member.id
    });
  const { isAuth } = UserAuth();
  const utils = api.useContext();
  const updateMember = api.members.update.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      utils.members.getAll.invalidate();
      close();
    }
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      joinDate: member.joinDate,
      exitDate: member.exitDate ?? null
    }
  });

  const checkedLastVisitedMeeting = (member: Member) => {
    const memberMeetings = member.meetings.filter(
      (meeting) => meeting.isVisited
    );
    const reversed = memberMeetings.reverse();
    const lastVisitedMeeting = meetings?.find(
      (meeting) => meeting.id === reversed[0]?.meetingId
    );

    return lastVisitedMeeting;
  };

  const lastVisitedMeeting = checkedLastVisitedMeeting(member);

  const onSubmitHandler = (values: typeof form.values) => {
    updateMember.mutate({
      id: member.id,
      firstName: values.firstName,
      lastName: values.lastName,
      joinDate: values.joinDate,
      exitDate: closeMembership ? values.exitDate ?? null : null
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Change member info">
        <form action="submit" onSubmit={form.onSubmit(onSubmitHandler)}>
          <InputBase
            label="First name"
            placeholder="Name"
            mb="24px"
            {...form.getInputProps("firstName")}
          />
          <InputBase
            label="Last name"
            placeholder="Name"
            mb="24px"
            {...form.getInputProps("lastName")}
          />
          <DateInput
            valueFormat="DD MMMM YYYY"
            label="Join Date"
            placeholder="join date"
            mb="24px"
            {...form.getInputProps("joinDate")}
          />
          <Checkbox
            onChange={(e) => setCloseMembership(e.target.checked)}
            label="Close Membership"
          />
          {closeMembership && (
            <DateInput
              valueFormat="DD MMMM YYYY"
              label="Exit Date"
              placeholder="exit date"
              mb="24px"
              {...form.getInputProps("exitDate")}
            />
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
      <tr>
        <td>
          <Group spacing="sm">
            <Avatar size={40} radius={40}>
              {member.firstName.charAt(0)}
              {member.lastName.charAt(0)}
            </Avatar>
            <div>
              <Link href={`/member/${member.id}`}>
                <Text fz="sm" fw={500}>
                  {member.firstName} {member.lastName}
                </Text>
              </Link>
            </div>
          </Group>
        </td>

        <td>
          <Text>{member.joinDate.toDateString()}</Text>
        </td>
        <td>
          <Text>{lastVisitedMeeting?.title} </Text>
        </td>
        <td>{countLastFourVisiting ? countLastFourVisiting : ""}</td>
        <td>
          {!member.exitDate ? (
            <Badge fullWidth>Active</Badge>
          ) : (
            <Badge color="gray" fullWidth>
              Non-active
            </Badge>
          )}
        </td>
        {isAuth && (
          <td className={styles.changeField}>
            <ActionIcon onClick={open}>
              <Pencil />
            </ActionIcon>
          </td>
        )}
      </tr>
    </>
  );
};

export default MemberRow;
