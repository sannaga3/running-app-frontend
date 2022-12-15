import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (identifier, password) => {
  const res = await fetch(`${API_URL}/api/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: identifier,
      password: password,
    }),
  });

  const data = await res.json();

  if (data.user) {
    Cookies.set("token", data.jwt, { expires: 7 });
  }

  return data;
};
