import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Document } from "mongoose";
import { GetServerSideProps } from "next";
import Api from "./../../../services/api";
import LayoutAdmin from "../../../layout/layoutAuthor";
import { PostCardAdmin, Navigation, SearchBar } from "../../../components";
import { Category, CategoryI} from "../../../database/models";
import DbConnect from "./../../../utils/dbConnect";
import { AuthorAuth } from "../../../utils/authentication";
import { cache } from "../../../services/cache";
import { getPageInfo } from "../../../services/getPageInfo";

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
  const [posts, setPosts] =
    useState<
      { title: string; description: string; image: string; link: string }[]
    >();

  const [filters, setFilters] = useState<{
    perPage: number;
    page: number;
    pages: number;
    search: string;
    category: string;
    author: string;
  }>({ search: "", page: 1, pages: 0, category: "", author: "", perPage: 12 });
  const [loading, setLoading] = useState<boolean>(false);

  const LoadPost = ({
    page,
    perPage,
    author,
    category,
    search,
  }: {
    page?: number;
    perPage?: number;
    author?: string;
    category?: string;
    search?: string;
  }) => {
    setLoading(true);
    const params = {
      select: "title description image link _id",
      author: author || "",
      category: category || "",
      perPage: `${perPage || 12}`,
      page: `${page || 1}`,
      search: `${search || ""}`,
      requestAs: "admin",
    };
    Api.get(`/api/post/list`, { params, withCredentials: true })
      .then((response) => {
        setPosts(response.data?.result);
        setLoading(false);
        setFilters({ ...filters, ...response.data });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    LoadPost({});
  }, []);

  return (
    <>
      <LayoutAdmin
        head={
          <title>
            {filters?.search || "Postagens"} - {info?.websiteName || ""}
          </title>
        }
        info={info}
        user={user}
      >
        <div className="container mx-auto">
          <Link href="/admin/post/create">
            <a>
              <button
                className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}
              >
                Nova postagem
              </button>
            </a>
          </Link>
          <button
            onClick={() => LoadPost({})}
            className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Recarregar
          </button>
          <hr />
          <SearchBar
            datas={{
              categories: categories?.map((category) => {
                return { name: category.name, link: category.name };
              }),
              authors: authors?.map((author) => {
                return { name: author.username, link: author.username };
              }),
              perPage: filters.perPage,
              search: filters.search,
            }}
            info={info}
            onSubmit={(e, datas) => {
              e.preventDefault();
              LoadPost({
                perPage: datas.perPage,
                search: datas.search,
                author: datas.author,
                category: datas.category,
              });
            }}
          />
          <Navigation
            callBack={(page) => LoadPost({ ...filters, page })}
            info={info}
            page={filters.page}
            pages={filters.pages}
          />
          <hr />
          <div className="grid grid-cols-4 py-2">
            {!loading ? (
              posts?.map((post, i) => {
                return (
                  <PostCardAdmin
                    requestAs="author"
                    info={info}
                    post={post}
                    editLink={"/admin/post/edit/" + encodeURI(post.link)}
                    reload={() => LoadPost({})}
                    key={i}
                  />
                );
              })
            ) : (
              <div className="col-span-4 flex justify-center items-center h-64">
                <img src="/img/load.gif" alt="loading" className="w-12" />
              </div>
            )}
          </div>
          <hr />
          <Navigation
            callBack={(page) => LoadPost({ ...filters, page })}
            info={info}
            page={filters.page}
            pages={filters.pages}
          />
        </div>
      </LayoutAdmin>
    </>
  );
};

export default Index;
