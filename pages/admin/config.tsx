import React, { useState } from "react";
import { GetServerSideProps } from "next";
import LayoutAdminArea from "../../layout/layoutAdmin";
import { Config } from "../../database/models";
import DbConnect from "./../../utils/dbConnect";
import WebsiteConfig from "../../components/forms/websiteConfig";
import HomePage from "../../components/forms/homePage";
import { PagesInfoI } from "../../utils/types";
import { AdminAuth } from "../../utils/authentication";
import { getPageInfo } from "../../services/getPageInfo";
import { cache } from "../../services/cache";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return AdminAuth({ req, res }, async ({ user }) => {
    await DbConnect();

    const info = cache({ name: "info" }, await getPageInfo());

    let HomePageInfo = null;
    try {
      HomePageInfo = await Config.findOne({ name: "homePageInfo" })
        .select(`-_id`)
        .exec();
    } catch (e) {}

    return {
      props: {
        Info: info,
        user,
        HomePageInfo: HomePageInfo.toJSON().content,
      },
    };
  });
};

const Index = ({ Info, user, HomePageInfo }) => {
  const [infoInputs, setInfoInputs] = useState<PagesInfoI>(Info);

  return (
    <>
      <LayoutAdminArea
        head={
          <>
            <title>Configurações - {infoInputs?.websiteName}</title>
            <link rel="stylesheet" href="/css/admin/config.css" />{" "}
            <style>
              {`
            @keyframes slideInFromLeft {
              0% {
                transform: translateY(-20%);
                opacity: 0.7;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .slide-up { 
              animation: 0.25s ease-out 0s 1 slideInFromLeft;
            }
            
            `}
            </style>
          </>
        }
        info={infoInputs}
        user={user}
      >
        <div className="container py-4 mx-auto">
          <WebsiteConfig
            Info={Info}
            infoInputs={infoInputs}
            setInfoInputs={setInfoInputs}
          />

          <HomePage info={infoInputs} homePageInfo={HomePageInfo} />
        </div>
      </LayoutAdminArea>
    </>
  );
};

export default Index;
