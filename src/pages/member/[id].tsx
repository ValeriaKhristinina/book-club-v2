import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Layout from "~/components/layout/layout";
import { Button, List } from "@mantine/core";
import { useState } from "react";

const Member: NextPage = () => {
  const router = useRouter();
  const memberID = router.query.id;
  const [isShowAll, setIsShowAll] = useState(false);

  const { data: member } = api.members.getById.useQuery({
    id: Number(memberID)
  });
  const visetedMeetings = member?.meetings
    .filter((meeting) => meeting.isVisited)
    .reverse();

  const showMeeting = 5;

  return (
    <Layout>
      <>
        <h1>
          {member?.firstName} {member?.lastName}
        </h1>

        <h2>Last {showMeeting} visited meetings</h2>
        <List className="mb-4">
          {visetedMeetings?.slice(0, showMeeting).map((meeting) => {
            return (
              <List.Item
                key={meeting.meetingId}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                    <path d="M3 6l0 13" />
                    <path d="M12 6l0 13" />
                    <path d="M21 6l0 13" />
                  </svg>
                }
              >
                {meeting.meeting.title} by {meeting.meeting.author}
              </List.Item>
            );
          })}
        </List>
        {isShowAll && (
          <List className="mb-4">
            {visetedMeetings?.slice(showMeeting).map((meeting) => {
              return (
                <List.Item
                  key={meeting.meetingId}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                      <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                      <path d="M3 6l0 13" />
                      <path d="M12 6l0 13" />
                      <path d="M21 6l0 13" />
                    </svg>
                  }
                >
                  {meeting.meeting.title} by {meeting.meeting.author}
                </List.Item>
              );
            })}
          </List>
        )}
        <Button
          variant="light"
          color="cyan"
          onClick={() => setIsShowAll(!isShowAll)}
          className="mt-4"
        >
          {isShowAll ? "Hide visited meeting" : "Show all visited meetings"}
        </Button>
      </>
    </Layout>
  );
};

export default Member;
