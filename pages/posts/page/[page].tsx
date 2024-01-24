import { Inter } from "next/font/google";
import {
  getAllPosts,
  getNumberOfPage,
  getPostsByPage,
  getPostsForTopPage,
} from "@/lib/notionAPI";
import Head from "next/head";
import SinglePost from "@/components/Post/SinglePost";
import { GetStaticPaths, GetStaticProps } from "next";
import Pagenation from "@/components/Pagenation/Pagenation";

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPage();

  let params = [];
  for (let i = 1; i <= numberOfPage; i++) {
    params.push({ params: { page: i.toString() } });
  }

  return {
    paths: params,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page;

  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10)
  );

  const numberOfPage = await getNumberOfPage();

  return {
    props: {
      postsByPage,
      numberOfPage,
    },
    revalidate: 10,
  };
};

const BlogPageList = ({ postsByPage, numberOfPage }) => {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-midium text-center mb-16">
          Notion Blog🚀
        </h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {postsByPage.map((post) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPagenationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagenation numberOfPage={numberOfPage} />
      </main>
    </div>
  );
};

export default BlogPageList;
