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

export const sortDefaultState = [
  { name: "id", sort: null },
  { name: "date", sort: "desc" },
  { name: "distance", sort: null },
  { name: "time", sort: null },
  { name: "per_time", sort: null },
  { name: "step", sort: null },
  { name: "cal", sort: null },
];

export const recordSortState = atom({
  key: "recordSortState",
  default: {
    ...sortDefaultState,
  },
  effects_UNSTABLE: [persistAtom],
});

export const searchDefaultState = {
  id_min: null,
  id_max: null,
  date_min: null,
  date_max: null,
  distance_min: null,
  distance_max: null,
  time_min: null,
  time_max: null,
  per_time_min: null,
  per_time_max: null,
  step_min: null,
  step_max: null,
  cal_min: null,
  cal_max: null,
};

export const recordSearchState = atom({
  key: "recordSearchState",
  default: {
    ...searchDefaultState,
  },
  effects_UNSTABLE: [persistAtom],
});

export const defaultTotalFormState = {
  totalPeriodType: "per_month",
  date_min: null,
  date_max: null,
  targetColumns: ["date"],
  options: [],
};

export const recordTotalFormState = atom({
  key: "recordTotalState",
  default: {
    ...defaultTotalFormState,
  },
  effects_UNSTABLE: [persistAtom],
});

export const totalRecordListState = atom({
  key: "totalRecordListState",
  default: [],
});

export const totalResultState = atom({
  key: "totalResultState",
  default: [],
});
