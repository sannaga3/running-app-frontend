import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useRecoilValue } from "recoil";

import { userState } from "../../states/auth";
import FlashMessage from "../../components/messages/flashMessage";

const userProfile = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <>
      <Head>
        <title>プロフィール</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flexCol items-center">
        <p className="pageTitle">プロフィール</p>
      </div>
      <FlashMessage flashMessage={router.query} />
      <div>
        <div>{user?.id && user.username}</div>
      </div>
    </>
  );
};

export default userProfile;
