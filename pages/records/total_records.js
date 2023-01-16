import Head from "next/head";

import TotalRecordForm from "./totalRecordForm";

const total_records = () => {
  return (
    <>
      <Head>
        <title>記録集計</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pageTitle">記録集計</div>
      <div className="absolute top-0 right-0"></div>
      <TotalRecordForm />
    </>
  );
};

export default total_records;
