import { useRouter } from "next/router";

import Button from "../../components/atoms/button";
import FlashMessage from "../../components/messages/flashMessage";

const profile = ({ user, isEdit, setIsEdit }) => {
  const router = useRouter();

  const contentAreaStyle =
    "flex justify-center space-x-10 border-b-4 border-gray-400 px-20 py-2";
  const contentWidth = { width: "200px" };

  return (
    <>
      <div className="flexCol items-center">
        <FlashMessage flashMessage={router.query} />
      </div>
      <div className="flex justify-center space-x-8">
        <div className="flexCol items-center space-y-5 text-xl font-bold text-gray-500">
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
            onclick={() => setIsEdit(!isEdit)}
            color="amber"
            width="120px"
            height="35px"
          />
          <Button
            text="削除"
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
