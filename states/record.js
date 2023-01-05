import { atom } from "recoil";
import persistAtom from "./persist";

export const myRecordListState = atom({
  key: "myRecordListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const failureRowListState = atom({
  key: "failureRowListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const recordSortState = atom({
  key: "recordSortState",
  default: [
    { name: "id", sort: null },
    { name: "date", sort: "desc" },
    { name: "distance", sort: null },
    { name: "time", sort: null },
    { name: "per_time", sort: null },
    { name: "step", sort: null },
    { name: "cal", sort: null },
  ],
  effects_UNSTABLE: [persistAtom],
});
