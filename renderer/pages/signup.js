import { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Input from "../components/atoms/input";
import Button from "../components/atoms/button";
import FormError from "../components/messages/formError";
import FlashMessage from "../components/messages/flashMessage";
import { signupUser } from "./api/auth";
import { userState } from "../states/auth";

const Signup = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [flashMessage, setFlashMessage] = useState(null);

  if (!user.id) Cookies.remove("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      username: null,
      email: null,
      password: null,
      password_confirm: null,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    const [name, email, password] = getValues([
      "username",
      "email",
      "password",
    ]);
    const fetchedData = await signupUser(name, email, password);

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

    router.push({
      pathname: `/users/${setData.id}`,
      query: {
        type: "success",
        message: "ログインしました",
      },
    });
  };

  return (
    <div>
      <Head>
        <title>login</title>
        <meta name="description" content="Signup for using this app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flexCol items-center">
        <div className="pageTitle">サインアップ</div>
        <FormError errors={errors} />
        <FlashMessage flashMessage={flashMessage} />
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
            required={true}
          />
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
          <Input
            label="パスワード確認用"
            name="password_confirm"
            type="password"
            register={register}
            required={true}
            minLen={6}
            getValues={getValues}
            getValueKey={"パスワード"}
            trigger="password"
          />
          <div className="pt-10">
            <Button
              text="送信"
              type="submit"
              color="gray"
              width="120px"
              height="35px"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
