import Head from "next/head";

import { api } from "~/utils/api";
import styles from "./index.module.css";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");

  // Note: As I mentioned in my writeup, for an actual solution we would want to use an useInfiniteQuery here.
  const { data } = api.food.search.useQuery({ searchStr: input });

  return (
    <>
      <Head>
        <title>Search Exercise</title>
        <meta name="description" content="search exercise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <input
          type="text"
          style={{ width: "500px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className={styles.container}>
          {data?.map((food) => (
            <div key={food.id}>{food.name}</div>
          ))}
        </div>
      </main>
    </>
  );
}
