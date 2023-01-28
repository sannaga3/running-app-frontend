import { atom } from "recoil";
import persistAtom from "./persist";
import dayjs from "dayjs";

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
  { name: "time_second", sort: null },
  { name: "per_time_second", sort: null },
  { name: "step", sort: null },
  { name: "cal", sort: null },
];

export const recordSortState = atom({
  key: "recordSortState",
  default: [...sortDefaultState],
  effects_UNSTABLE: [persistAtom],
});

export const searchDefaultState = {
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
  date_min: dayjs().format("YYYY-MM-DD"),
  date_max: null,
  targetColumns: ["date"],
  options: [],
  limit: 5,
};

export const recordTotalFormState = atom({
  key: "recordTotalFormState",
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
