import { ScrollArea, Table } from "@mantine/core";
import { type Member } from "../../types/member";
import { useState } from "react";
import MemberRow from "../member-row/member-row";
interface MembersTableProps {
  members: Member[] | undefined;
}

export function MembersTable({ members }: MembersTableProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const isAuth = true;

  if (!members) {
    return <h1>no member</h1>;
  }

  const rows = members.map((item) => <MemberRow member={item} key={item.id} />);

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
