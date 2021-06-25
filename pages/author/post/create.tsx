import React from "react";
import Link from "next/link";
import Router from "next/router";
import { GetServerSideProps } from "next";
import { Document } from "mongoose";
import LayoutAdmin from "../../../layout/layoutAuthor";
import Post from "../../../components/forms/post";
import { Category, CategoryI } from "../../../database/models";
import DbConnect from "./../../../utils/dbConnect";
import { AuthorAuth } from "../../../utils/authentication";
import { getPageInfo } from "../../../services/getPageInfo";
import { cache } from "../../../services/cache";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return AuthorAuth({ req, res }, async ({ user }) => {
    await DbConnect();

    const info = cache({ name: "info" }, await getPageInfo());

    let categories: (CategoryI & Document<any, any>)[] = null;
    try {
      categories = await Category.find({}).select(`name -_id`).exec();
    } catch (e) {}

    let authors = null;
    try {
      authors = [{ username: user?.username, link: user?.link || null }];
    } catch (e) {}

    return {
      props: {
        info,
        user: { username: user.username },
        authors: authors,
        categories: categories?.map((category) => category.toJSON()),
      },
    };
  });
};

const Index = ({ info, user, authors, categories }) => {
  return (
    <>
      <LayoutAdmin head={<title>Novo Post</title>} info={info} user={user}>
        <div className="container mx-auto">
          <div>
            <Link href="/admin/post">
              <a>
                <button
                  className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}
                >
                  Voltar
                </button>
              </a>
            </Link>
          </div>
          <hr />
          <div>
            <Post
              requestAs={"author"}
              onSubmit={() => {
                Router.push("/author/post");
              }}
              info={info}
              authors={authors}
              categories={categories}
            />
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
};

export default Index;
