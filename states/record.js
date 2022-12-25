import { atom } from "recoil";
import persistAtom from "./persist";

export const myRecordListState = atom({
  key: "myRecordListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
