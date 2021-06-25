import React from "react";
import { GetServerSideProps } from "next";
import LayoutAdmin from "../../layout/layoutAuthor";
import DbConnect from "./../../utils/dbConnect";
import { AuthorAuth } from "../../utils/authentication";
import { cache } from "../../services/cache";
import { getPageInfo } from "../../services/getPageInfo";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return AuthorAuth({ req, res }, async ({ user }) => {
    await DbConnect();

    const info = cache({ name: "info" }, await getPageInfo());

    return {
      props: {
        info,
        user: {
          username: user?.username || null,
        },
      },
    };
  });
};

const Index = ({ info, user }: { info: any; user: any }) => {
  return (
    <>
      <LayoutAdmin
        head={<title>Página Inicial</title>}
        info={info}
        user={user}
      ></LayoutAdmin>
    </>
  );
};

export default Index;
