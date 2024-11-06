import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Layout from "~/components/layout/layout";
import { Box, Button, Flex, List } from "@mantine/core";
import { useState } from "react";

const BookIcon = () => {
  return (
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
  );
};

const Member: NextPage = () => {
  const router = useRouter();
  const memberID = router.query.id;
  const [isShowAllVisited, setIsShowAllVisited] = useState(false);
  const [isShowAllChoosen, setIsShowAllChoosen] = useState(false);

  const { data: member } = api.members.getById.useQuery({
    id: Number(memberID)
  });
  const visetedMeetings = member?.meetings
    .filter((meeting) => meeting.isVisited)
    .reverse();

  const showMeeting = 5;

  const joinDate = member?.joinDate;
  console.log(joinDate);

  return (
    <Layout>
      <>
        <h1>
          {member?.firstName} {member?.lastName}
        </h1>
        {/* <h3>Since {member?.firstName}</h3> */}

        <Flex direction="row" justify={"space-between"}>
          <Box w="50%" mr="24px">
            <h2>Last {showMeeting} visited meetings</h2>
            <List className="mb-4">
              {visetedMeetings?.slice(0, showMeeting).map((meeting) => {
                return (
                  <List.Item key={meeting.meetingId} icon={<BookIcon />}>
                    {meeting.meeting.title} by {meeting.meeting.author}
                  </List.Item>
                );
              })}
            </List>
            {isShowAllVisited && (
              <List className="mb-4">
                {visetedMeetings?.slice(showMeeting).map((meeting) => {
                  return (
                    <List.Item key={meeting.meetingId} icon={<BookIcon />}>
                      {meeting.meeting.title} by {meeting.meeting.author}
                    </List.Item>
                  );
                })}
              </List>
            )}
            <Button
              variant="light"
              color="cyan"
              onClick={() => setIsShowAllVisited(!isShowAllVisited)}
            >
              {isShowAllVisited
                ? "Hide visited meeting"
                : "Show all visited meetings"}
            </Button>
          </Box>
          <Box w="50%">
            <h2>Chosen book</h2>
            <List>
              {member?.chosenMeetings.slice(0, showMeeting).map((book) => (
                <List.Item key={book.id} icon={<BookIcon />}>
                  {book.title}
                </List.Item>
              ))}
            </List>
            {isShowAllChoosen && (
              <List className="mb-4">
                {member?.chosenMeetings?.slice(showMeeting).map((book) => {
                  return (
                    <List.Item key={book.id} icon={<BookIcon />}>
                      {book.title} by {book.author}
                    </List.Item>
                  );
                })}
              </List>
            )}
            <Button
              variant="light"
              color="cyan"
              onClick={() => setIsShowAllChoosen(!isShowAllChoosen)}
            >
              {isShowAllVisited
                ? "Hide chosen meeting"
                : "Show all chosen meetings"}
            </Button>
          </Box>
        </Flex>
      </>
    </Layout>
  );
};

export default Member;
