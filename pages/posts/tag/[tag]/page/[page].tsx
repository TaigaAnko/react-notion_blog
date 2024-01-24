import { Inter } from "next/font/google";
import {
  getAllPosts,
  getAllTags,
  getNumberOfPage,
  getNumberOfPageByTag,
  getPostsByPage,
  getPostsByTagAndPage,
  getPostsForTopPage,
} from "@/lib/notionAPI";
import Head from "next/head";
import SinglePost from "@/components/Post/SinglePost";
import { GetStaticPaths, GetStaticProps } from "next";
import Pagenation from "@/components/Pagenation/Pagenation";

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();
  let params = [];

  await Promise.all(
    allTags.map((tag: string) => {
      return getNumberOfPageByTag(tag).then((numberOfPageByTag: number) => {
        for (let i = 1; i <= numberOfPageByTag; i++) {
          params.push({ params: { tag: tag, page: i.toString() } });
        }
      });
    })
  );

  return {
    paths: params,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage: string = context.params?.page.toString();
  const currentTag: string = context.params?.tag.toString();

  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(
    upperCaseCurrentTag,
    parseInt(currentPage, 10)
  );

  const numberOfPageByTag = await getNumberOfPageByTag(upperCaseCurrentTag);

  return {
    props: {
      posts,
      numberOfPageByTag,
    },
    revalidate: 10,
  };
};

const BlogTagPageList = ({ numberOfPageByTag, posts }) => {
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
          {posts.map((post) => (
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
        <Pagenation numberOfPage={numberOfPageByTag} />
      </main>
    </div>
  );
};

export default BlogTagPageList;
