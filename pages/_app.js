import Head from "next/head";
// import Layout from "../components/Layout/layout";
import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout/layout"), {
  ssr: false,
});

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
};

export default MyApp;
