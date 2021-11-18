import styles from "../styles/Home.module.css";

import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import MoviebyTitle from "../component/moviebyTitle";
import MovieByYear from "../component/movieByYear";
import MovieByDirector from "../component/movieByDirector";
import MovieByCountry from "../component/movieByCountry";
import MovieByMain from "../component/movieByMain";
import { client } from "./_app";

function App({ mainData }) {
  const { register, handleSubmit, resetField, watch } = useForm();
  const [searchData, setSearchOption] = useState({ search: "default" });

  // useEffect(() => {
  //   if (!titleLoading) {
  //     setMovieData(byTitleData);
  //   }
  //   console.log(movieTitle);
  //   console.log(movieData);
  // }, [titleLoading]);

  const onSubmit = (data) => {
    console.log(data);
    if (data.title === "" && data.search !== "default") {
      alert(`Please Type ${data.search}`);
      return;
    }
    setSearchOption(data);
  };

  return (
    <div className={styles.container}>
      <title>Create Next App</title>

      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Noogle</h1>
        <h2 className={styles.subtitle}>brought to you by NETFLIX</h2>

        <div className={styles.description}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <select name="Search by" {...register("search")}>
              <option value="default">Search By Luck</option>
              <option value="title">Search By Title</option>
              <option value="year">Search By Year</option>
              <option value="director">Search By Director</option>
              <option value="country">Search By Country</option>
            </select>
            <select name="limit" {...register("limit")}>
              <option value="5">Result Limit 5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="100">100</option>
            </select>
            {watch("search") === "default" || watch("search") === undefined ? (
              <input type="submit" value="I'm feeling lucky" />
            ) : (
              <>
                <input type="text" {...register("title")} />
                <input type="submit" value="SEARCH" />{" "}
              </>
            )}
          </form>
        </div>

        {searchData?.search === "default" ? (
          <>
            <h1>Noogle Recommends</h1>
            <MovieByMain data={mainData} />
          </>
        ) : null}
        {searchData?.search === "title" ? (
          <MoviebyTitle query={searchData} />
        ) : null}
        {searchData?.search === "year" ? (
          <MovieByYear query={searchData} />
        ) : null}

        {searchData?.search === "director" ? (
          <MovieByDirector query={searchData} />
        ) : null}

        {searchData?.search === "country" ? (
          <MovieByCountry query={searchData} />
        ) : null}

        {/* <div className={styles.grid}>
          {titleLoading
            ? "Loading..."
            : movieData?.titles?.map((movie) => {
                return (
                  <a href="https://nextjs.org/docs" className={styles.card}>
                    <h2>{movie.Title}</h2>
                    <p>{movie.director.director}</p>
                    <p>{movie.release.release_year}</p>
                  </a>
                );
              })}
        </div> */}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}

export default App;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query Query {
        titles(options: { limit: 100 }) {
          Title
          release {
            release_year
          }
          director {
            director
          }
          country {
            country
          }
        }
      }
    `,
  });

  return {
    props: {
      mainData: data,
    },
  };
}
