import { atom } from "recoil";
import persistAtom from "./persist";

export const activeRouteState = atom({
  key: "activeRouteState",
  default: {
    id: null,
    username: null,
    email: null,
  },
  effects_UNSTABLE: [persistAtom],
});
