import React from "react";
import { GetServerSideProps } from "next";
import { AdminAuth } from "../../utils/authentication";
import DbConnect from "./../../utils/dbConnect";
import LayoutAdminArea from "../../layout/layoutAdmin";
import { getPageInfo } from "../../services/getPageInfo";
import { cache } from "../../services/cache";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return AdminAuth({ req, res }, async ({ user }) => {
    await DbConnect();

    const info = cache({ name: "info" }, await getPageInfo());

    return {
      props: {
        info,
        user,
      },
    };
  });
};

const Index = ({ info, user }) => {
  return (
    <>
      <LayoutAdminArea
        head={<title>Página Inicial</title>}
        info={info}
        user={user}
      >
          
      </LayoutAdminArea>
    </>
  );
};

export default Index;
