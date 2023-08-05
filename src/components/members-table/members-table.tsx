import styles from './members-table.module.css';
import { Avatar, Table, Group, Text, ScrollArea, Badge } from '@mantine/core';
import { type Member } from '@prisma/client';
import Link from 'next/link';
import { ActionIcon } from '@mantine/core';
import { Pencil } from 'tabler-icons-react';
import { useState } from 'react';

interface MembersTableProps {
  members: Member[] | undefined;
}

export function MembersTable({ members }: MembersTableProps) {
  const [isEditingMode, setIsEditingMode] = useState(false)
  const isAuth = true

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
      {isAuth && (
        <td className={styles.changeField}><ActionIcon onClick={()=> setIsEditingMode(!isEditingMode)}><Pencil/></ActionIcon></td>
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
            {isAuth && (
              <th>Change</th>
            )}
            
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
