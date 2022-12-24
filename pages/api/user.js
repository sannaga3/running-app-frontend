import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const editUser = async (username, email, password) => {
  const params = {
    username: username,
    email: email,
  };
  if (password) params.password = password;

  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/api/user/me/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...params }),
  });

  if (res.ok) return { ...params };
  return { error: true };
};
