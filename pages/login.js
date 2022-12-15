import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

import Input from "../components/atoms/input";
import Button from "../components/atoms/button";
import FormError from "../components/messages/formError";
import FlashMessage from "../components/messages/flashMessage";
import { loginUser } from "./api/auth";
import { userState } from "../states/auth";
import { useState } from "react";

const login = () => {
  const [user, setUser] = useRecoilState(userState);
  const [flashMessage, setFlashMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: null,
      email: null,
      password: null,
      password_confirm: null,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    const [email, password] = getValues(["email", "password"]);
    const fetchedData = await loginUser(email, password);

    if (fetchedData.error) {
      return setFlashMessage({
        type: "error",
        message: "ログインに失敗しました",
      });
    }

    const setData = {
      id: fetchedData.user.id,
      username: fetchedData.user.username,
      email: fetchedData.user.email,
    };

    setUser(setData);

    // window.location.href = "/";
  };

  return (
    <div>
      <Head>
        <title>login</title>
        <meta name="description" content="login for using this app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flexCol items-center">
        <div className="pageTitle">ログイン</div>
        <FormError errors={errors} />
        <FlashMessage flashMessage={flashMessage} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flexCol items-center space-y-2"
        >
          <Input
            label="メールアドレス"
            name="email"
            type="email"
            register={register}
            required={true}
          />
          <Input
            label="パスワード"
            name="password"
            type="password"
            register={register}
            required={true}
          />
          <div className="mt-5">
            <Button
              text="送信"
              type="submit"
              color="amber"
              width="120px"
              height="35px"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default login;
