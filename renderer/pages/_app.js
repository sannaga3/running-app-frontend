import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/layout/layout"), {
  ssr: false,
});

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <Layout>
        <div className="fixed top-0 left-0 w-full h-screen z-[-2]">
          <img
            src="/daniel-storek-JM-qKEd1GMI-unsplash.jpg"
            alt="running shoes"
            className="w-full h-full"
          />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen z-[-1] bg-gray-200 opacity-50"></div>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  );
};

export default MyApp;
