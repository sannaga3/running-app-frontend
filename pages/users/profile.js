import { useState } from "react";
import { useRouter } from "next/router";

import Button from "../../components/atoms/button";
import FlashMessage from "../../components/messages/flashMessage";
import { destroyUser } from "../api/user";
import { useRecoilState } from "recoil";
import { userState } from "../../states/auth";

const profile = ({ isEdit, setIsEdit }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [error, setError] = useState(null);

  const contentAreaStyle =
    "flex justify-center space-x-10 border-b-2 border-gray-700 px-20 py-2";
  const contentWidth = { width: "200px" };

  const deleteUser = async () => {
    if (window.confirm("アカウントを削除しますか？")) {
      const res = await destroyUser(user.id);

      if (res.ok) {
        setUser({
          id: null,
          username: null,
          email: null,
        });

        return router.push({
          pathname: `/login`,
          query: {
            type: "success",
            message: "アカウントを削除しました。ご利用ありがとうございました。",
          },
        });
      } else {
        setError({
          type: "error",
          message: "アカウントの削除に失敗しました",
        });
      }
    }
  };

  return (
    <>
      <div className="flexCol items-center">
        <FlashMessage flashMessage={error ?? router.query} />
      </div>
      <div className="flex justify-center space-x-8">
        <div className="flexCol items-center space-y-5 text-xl font-bold text-gray-700">
          <div className={contentAreaStyle}>
            <div style={contentWidth}>名前 : </div>
            <div style={contentWidth}>{user.username}</div>
          </div>
          <div className={contentAreaStyle}>
            <div style={contentWidth}>メールアドレス : </div>
            <div style={contentWidth}>{user.email}</div>
          </div>
        </div>
        <div className="flex justify-end items-end space-x-5">
          <Button
            text="編集"
            type="button"
            onClick={() => setIsEdit(!isEdit)}
            color="amber"
            width="120px"
            height="35px"
          />
          <Button
            text="削除"
            onClick={() => deleteUser()}
            type="submit"
            color="red"
            width="120px"
            height="35px"
          />
        </div>
      </div>
    </>
  );
};

export default profile;
