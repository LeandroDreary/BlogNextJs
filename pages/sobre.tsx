import React from "react";
import Layout from "./../layout/layout";
import { GetServerSideProps } from "next";
import { Category } from "../database/models";
import DbConnect from "../utils/dbConnect";
import { cache } from "../services/cache";
import { getPageInfo } from "../services/getPageInfo";

export const getServerSideProps: GetServerSideProps = async () => {
  await DbConnect();

  const info = cache({ name: "info" }, await getPageInfo());

  let categories = null;
  try {
    categories = await Category.find({}).exec();
    categories = categories._doc.content;
  } catch (e) {}

  return {
    props: {
      info,
      categories: categories?.map((c) => {
        return { color: c?.color, link: c?.link || null, name: c?.name };
      }),
    },
  };
};

const Index = ({ info, categories }) => {
  return (
    <>
      <Layout
        head={<title>Sobre - {info?.websiteName}</title>}
        info={info}
        categories={categories}
      >
        <div className="mx-auto container grid grid-cols-5 pb-4 items-center">
          <div className="col-span-5 md:col-span-3 px-3 md:px-6 my-8">
            <h1 className="text-2xl font-semibold text-gray-700 mb-2">
              Mais sobre Blog Next JS!
            </h1>
            <hr />
            <p className="text-lg text-gray-600 my-6">
              Blog Next Js, um blog customizável que pode trazer visibilidade
              para você na internet
            </p>
            <p className="text-lg text-gray-600 my-6">
              BlogNextJs foi criado para pessoas que queiram começar a mostrar
              uma atividade na internet a baixo custo mas mesmo assim com
              qualidade e velocidade. Com esse Repositório você pode hospedar um
              blog inteiro sem ter conhecimento técnico avançado em programação
              ou coisas do tipo. Tudo o que você precisa é de uma conta na
              MongoDB e na ImgBB. Domínio fica a seu critério pagar por um ou
              não.
            </p>
            <p className="text-lg text-gray-600 my-6">
              Qualquer um pode ter participação digital na internet!
            </p>
          </div>
          <div className="col-span-5 md:col-span-2 my-8">
            <div className={`mx-4`}>
              <img
                className="w-full p-6 mx-auto"
                src={info?.icon}
                alt="icone"
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
