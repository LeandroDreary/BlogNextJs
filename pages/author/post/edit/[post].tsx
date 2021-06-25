import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Router from "next/router";
import { Document } from "mongoose";
import LayoutAdmin from "../../../../layout/layoutAuthor";
import Post from "../../../../components/forms/post";
import Api from "../../../../services/api";
import {
  Category,
  CategoryI,
  Config,
  ConfigI,
} from "../../../../database/models";
import DbConnect from "./../../../../utils/dbConnect";
import { AuthorAuth } from "../../../../utils/authentication";
import { getPageInfo } from "../../../../services/getPageInfo";
import { cache } from "../../../../services/cache";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
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
        link: params.post,
        user: { username: user.username },
        authors: authors,
        categories: categories?.map((category) => category.toJSON()),
      },
    };
  });
};

function Blog({ info, user, link, authors, categories }) {
  const [post, setPost] = useState<any>();

  useEffect(() => {
    if (link) {
      let params = { link, requestAs: "author" };
      Api.get(`/api/post`, { params, withCredentials: true }).then((response) =>
        setPost(response.data?.result)
      );
    }
  }, [link]);

  return (
    <>
      <LayoutAdmin
        head={<title>Editar post - {post?.title}</title>}
        info={info}
        user={user}
      >
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
            {post?._id ? (
              <Post
                requestAs={"author"}
                onSubmit={() => {
                  Router.push("/author/post");
                }}
                info={info}
                Post={post}
                authors={authors}
                categories={categories}
              />
            ) : (
              <div className="flex justify-center items-center h-64">
                <img src="/img/load.gif" alt="loading" className="w-12" />
              </div>
            )}
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default Blog;
