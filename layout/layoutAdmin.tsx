import React, { ReactNode } from "react";
import { Footer, NavbarAdmin } from "../components";
import Head from "next/head";
import ReactHtmlParser from "react-html-parser";

interface props {
  head?: any;
  navbar?: any;
  footer?: any;
  info?: any;
  user?: any;
  children: ReactNode;
}

let Index = ({ footer, head, navbar, user, info, children }: props) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {ReactHtmlParser(info?.customLayoutStyles)}
        {head}
      </Head>
      {navbar ? navbar : <NavbarAdmin user={user} info={info} />}

      <div className="flex">
        <div className="w-80 h-screen p-4">
          <div
            className={`h-full p-3 w-full bg-${info?.colors.background?.color}`}
          >
            <div className={`pb-2 text-${info?.colors.text?.color}`}>
              <p className="text-lg font-semibold">Categorias</p>
              <hr />
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>

      {footer ? footer : <Footer info={info} />}
    </>
  );
};

export default Index;
