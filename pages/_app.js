import Head from "next/head";
import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";

const Layout = dynamic(() => import("../components/Layout/layout"), {
  ssr: false,
});

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" />
      </Head>
      <Layout>
        <div className="fixed top-0 left-0 w-full h-screen z-[-2]">
          <Image
            src="/mukesh-naik-jVerIoX3y7c-unsplash.jpg"
            layout="fill"
            objectFit="cover"
            alt="running shoes"
          />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen z-[-1] bg-gray-400 opacity-30"></div>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
};

export default MyApp;
