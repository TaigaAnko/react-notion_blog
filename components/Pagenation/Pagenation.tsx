import Link from "next/link";
import React from "react";

interface Props {
  numberOfPage: number;
}

const Pagenation = (props: Props) => {
  const { numberOfPage } = props;

  let pages: number[] = [];
  for (let i = 1; i <= numberOfPage; i++) {
    pages.push(i);
  }

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justify-center gap-4">
        {pages.map((page) => (
          <li className="bg-sky-900 rounded-lg w-6 h-8 relative" key={page}>
            <Link
              href={`/posts/page/${page}`}
              className="text-xs absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100"
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Pagenation;
