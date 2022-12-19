import { atom } from "recoil";
import persistAtom from "./persist";

export const userState = atom({
  key: "userState",
  default: {
    id: null,
    username: null,
    email: null,
  },
  effects_UNSTABLE: [persistAtom],
});
