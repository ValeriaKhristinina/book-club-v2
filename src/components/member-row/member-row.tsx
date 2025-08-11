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
  Checkbox
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

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name should have at least 1 letters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name should have at least 1 letters" }),
  exitDate: z.date({
    required_error: "Please select a exit date",
    invalid_type_error: "That's not a date!"
  }),
  joinDate: z.date({
    required_error: "Please select a join date",
    invalid_type_error: "That's not a date!"
  })
});

const MemberRow = ({ member }: { member: Member }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [closeMembership, setCloseMembership] = useState(false);

  const { data: meetings } = api.meetings.getAll.useQuery();
  const isAuth = true;

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      exitDate: member.exitDate,
      joinDate: member.joinDate
    }
  });

  const checkedLastVisitedMeeting = (member: Member, meetings: Meeting[]) => {
    const reversedMemberMeeting = [...member.meetings].reverse();
    const meetingId = reversedMemberMeeting
      ? reversedMemberMeeting.find((meeting) => meeting.isVisited === true)
      : 0;

    const lastMeeting = meetings?.find((meeting) => meeting.id === meetingId);
    return lastMeeting;
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Change member info">
        <form action="submit">
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
          <Text>
            {
              checkedLastVisitedMeeting(member, meetings || [EMPTY_MEETING])
                ?.title
            }{" "}
          </Text>
        </td>
        <td>here viseted last 4 meeting</td>
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
