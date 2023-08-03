import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

import Layout from '~/components/layout/layout';

const Member: NextPage = () => {
  const router = useRouter();
  const memberID = router.query.id;

  const { data: member } = api.members.getById.useQuery({
    id: Number(memberID)
  });
  const visetedMiitings = member?.meetings.filter(
    (meeting) => meeting.isVisited
  );

  return (
    <Layout>
      <>
        <h1>Hello! {member?.firstName}</h1>

        <ul>
          {visetedMiitings?.map((meeting) => {
            return <li key={meeting.meetingId}>{meeting.meetingId}</li>;
          })}
        </ul>
      </>
    </Layout>
  );
};

export default Member;
