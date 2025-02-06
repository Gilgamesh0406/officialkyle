import React from "react";
import UserModeration from "@/components/users/UserModeration";
import { Container } from "@mui/material";

interface UserModerationPageProps {
  params: Promise<{
    userid: string;
  }>;
}
interface UserModerationPageParams {
  params: {
    userid: string | null;
  };
}

const UserModerationPage: React.FC<UserModerationPageParams> = ({ params }) => {
  const { userid } = params;
  return userid ? (
    <Container maxWidth="lg">
      <UserModeration userid={userid} />
    </Container>
  ) : (
    <>Loading...</>
  );
};

export default async function UserModerationWrapper(
  props: UserModerationPageProps
) {
  const convertedParams = await props.params
    .then((params) => params)
    .catch((err) => {
      console.error(err);
      return { userid: null };
    }); // Await the params if it's a Promise
  return <UserModerationPage {...props} params={convertedParams} />;
}
