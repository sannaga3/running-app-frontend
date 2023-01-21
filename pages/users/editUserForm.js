import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import FormError from "../../components/messages/formError";
import FlashMessage from "../../components/messages/flashMessage";
import { userState } from "../../states/auth";
import { editUser } from "../api/user";

const editUserForm = ({ isEdit, setIsEdit }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [flashMessage, setFlashMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      password: user.password,
      password_confirm: user.password,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    let [username, email, password, password_confirm] = getValues([
      "username",
      "email",
      "password",
      "password_confirm",
    ]);

    if (username.length === 0) username = user.username;
    if (email.length === 0) email = user.email;
    if (password.length === 0) password = user.password;
    if (password_confirm.length === 0) password_confirm = user.password;

    const fetchedData = await editUser(
      username,
      email,
      password,
      password_confirm
    );

    if (fetchedData.error) {
      return setFlashMessage({
        type: "error",
        message: "ユーザー情報の更新に失敗しました",
      });
    }

    const setData = {
      id: user.id,
      username: fetchedData.username,
      email: fetchedData.email,
    };

    setUser(setData);
    setIsEdit(false);

    router.push({
      pathname: `/users/${user.id}`,
      query: {
        type: "success",
        message: "ユーザー情報を更新しました",
      },
    });
  };

  return (
    <div className="flexCol items-center space-y-2">
      <FlashMessage flashMessage={flashMessage} />
      <FormError errors={errors} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flexCol items-center space-y-2"
      >
        <Input
          label="名前"
          name="username"
          type="text"
          register={register}
          minLen={2}
          required={false}
        />
        <Input
          label="メールアドレス"
          name="email"
          type="email"
          register={register}
          required={false}
        />
        <Input
          label="パスワード"
          name="password"
          type="password"
          register={register}
          required={false}
        />
        <Input
          label="パスワード確認用"
          name="password_confirm"
          type="password"
          register={register}
          required={false}
          minLen={6}
          getValues={getValues}
          getValueKey={"パスワード"}
          trigger="password"
        />
        <div className="pt-10 space-x-5">
          <Button
            text="送信"
            type="submit"
            color="amber"
            width="120px"
            height="35px"
          />
          <Button
            text="中止"
            type="button"
            onClick={() => setIsEdit(!isEdit)}
            color="red"
            width="120px"
            height="35px"
          />
        </div>
      </form>
    </div>
  );
};

export default editUserForm;
