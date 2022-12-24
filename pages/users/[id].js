import { useState } from "react";
import Head from "next/head";

import Profile from "./profile";
import EditUserForm from "./editUserForm";

const userProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

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
      <>
        {isEdit ? (
          <EditUserForm isEdit={isEdit} setIsEdit={setIsEdit} />
        ) : (
          <Profile isEdit={isEdit} setIsEdit={setIsEdit} />
        )}
      </>
    </>
  );
};

export default userProfile;
