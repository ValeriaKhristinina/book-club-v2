import { Avatar, Table, Group, Text, ScrollArea, Badge } from '@mantine/core';
import { Member } from '@prisma/client';
import dayjs from 'dayjs';
import { it } from 'node:test';


interface MembersTableProps {
  members: Member[] | undefined;
}

export function MembersTable({ members }: MembersTableProps) {

  if (!members) {
    return (
      <h1>No members</h1>
    )
  }

  const rows = members.map((item) => (
    <tr key={item.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} radius={40}>{item.firstName.charAt(0)}{item.lastName.charAt(0)}</Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.firstName} {item.lastName}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Text>{item.joinDate.toDateString()}</Text>
      </td>
      <td>here last viseted meeting</td>
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
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
