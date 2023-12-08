import styles from './members-table.module.css';
import { Avatar, Table, Group, Text, ScrollArea, Badge } from '@mantine/core';
import { type Member } from '../../types/member';
import { type Meeting } from '../../types/meeting';
import Link from 'next/link';
import { ActionIcon } from '@mantine/core';
import { Pencil } from 'tabler-icons-react';
import { useState } from 'react';
import { api } from '../../utils/api';
import { EMPTY_MEMBER } from '~/const';

interface MembersTableProps {
  members: Member[] | undefined;
}

export function MembersTable({ members }: MembersTableProps) {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const isAuth = true;
  const { data: meetings } = api.meetings.getAll.useQuery();

  if (!members) {
    return (
      <h1>no member</h1>
    );
  }

  const checkedLastVisitedMeeting = (member: Member, meetings: Meeting[]) => {
    const reversedMemberMeeting = [...member.meetings].reverse();
    const meetingId = reversedMemberMeeting
      ? reversedMemberMeeting.find((meeting) => meeting.isVisited === true)
      : 0;

    const lastMeeting = meetings?.find((meeting) => meeting.id === meetingId);
    return lastMeeting

  };

  const rows = members.map((item) => (
    <tr key={item.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} radius={40}>
            {item.firstName.charAt(0)}
            {item.lastName.charAt(0)}
          </Avatar>
          <div>
            <Link href={`/member/${item.id}`}>
              <Text fz="sm" fw={500}>
                {item.firstName} {item.lastName}
              </Text>
            </Link>
          </div>
        </Group>
      </td>

      <td>
        <Text>{item.joinDate.toDateString()}</Text>
      </td>
      <td><Text>{checkedLastVisitedMeeting(item, meetings)} </Text></td>
      <td>here viseted last 4 meeting</td>
      <td>
        {!item.exitDate ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Non-active
          </Badge>
        )}
      </td>
      {isAuth && (
        <td className={styles.changeField}>
          <ActionIcon onClick={() => setIsEditingMode(!isEditingMode)}>
            <Pencil />
          </ActionIcon>
        </td>
      )}
    </tr>
  ));

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <thead>
          <tr>
            <th>Member</th>
            <th>Join Date</th>
            <th>Last active</th>
            <th>Vsited last four meetings</th>
            <th>Status</th>
            {isAuth && <th>Change</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
