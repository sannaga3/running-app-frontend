import Cookies from "js-cookie";
import { sortRecord } from "../records/util";
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/*
  myRecordList
*/
export const getMyRecordList = async (
  userId,
  meta,
  sortParams = null,
  searchParams = null
) => {
  const token = Cookies.get("token");

  let searchQuery = "";
  if (searchParams) {
    searchParams.forEach((param) => {
      const column = param.key;

      searchQuery =
        searchQuery +
        `&filters[${column.slice(0, -4)}]
        [${param.key.includes("min") ? "$gte" : "$lte"}]=${param.value}`;
    });
  }

  const url =
    searchQuery === ""
      ? `${API_URL}/api/records?filters[user_id][$eq]=${userId}&pagination[page]=${meta.page}&pagination[pageSize]=${meta.pageSize}&sort[0]=date%3Adesc`
      : `${API_URL}/api/records?filters[user_id][$eq]=${userId}&pagination[page]=${meta.page}&pagination[pageSize]=${meta.pageSize}&sort[0]=date%3Adesc${searchQuery}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    let recordList = await res.json();

    const convertedList = recordList.data.map((record) => {
      const converted = convertRecord(record);
      return converted;
    });

    if (sortParams.length > 0) {
      const sortedList = sortRecord(convertedList, sortParams);
      recordList.data = sortedList;
    } else {
      recordList.data = convertedList;
    }

    return recordList;
  }

  return { error: true };
};

/*
  editRecord
*/
export const editRecord = async (params, recordId) => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/api/records/${recordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: { ...params } }),
  });

  if (res.ok) {
    let record = await res.json();

    const converted = convertRecord(record);
    record.data = converted;

    return record;
  }

  return { error: true };
};

/*
  storeRecord
*/
export const storeRecord = async (params) => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/api/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: { ...params } }),
  });

  if (res.ok) {
    let record = await res.json();

    const converted = convertRecord(record);
    record.data = converted;

    return record;
  }

  return { error: true };
};

const convertRecord = (record) => {
  let converted = record?.data ? record.data.attributes : record.attributes;

  converted.id = record?.data ? record.data.id : record.id;
  converted.time = converted.time.replace(".000", "");
  converted.per_time = converted.per_time.replace(".000", "");
  delete converted.createdAt;
  delete converted.publishedAt;
  delete converted.updatedAt;

  return converted;
};

/*
  destroyRecord
*/
export const destroyRecord = async (id) => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/api/records/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  res.id = id;

  if (res.ok) return res;
  return { error: true };
};

/*
  myTotalRecordList
*/
export const getMyTotalRecordList = async (formValues) => {
  const token = Cookies.get("token");

  let params = { ...formValues };

  params = convertTotalPeriodAndChangeLimit(params);

  const res = await fetch(`${API_URL}/api/records/findTotalRecords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...params }),
  });

  if (res.ok) {
    const recordList = await res.json();
    return recordList;
  }

  return { error: true };
};

// 集計期間と取得レコード数のパラメータ設定
const convertTotalPeriodAndChangeLimit = (params) => {
  if (params.totalPeriodType === "per_month") {
    params.limit = 31;

    const dateElements = params.date_min.split("-");

    params.date_max = dayjs(params.date_min)
      .endOf("month")
      .format("YYYY-MM-DD");

    params.date_min = `${dateElements[0]}-${dateElements[1]}-01`;
  } else if (params.totalPeriodType === "per_year") {
    params.limit = 500;

    const dateElements = params.date_min.split("-");

    params.date_max = dayjs(params.date_min).endOf("year").format("YYYY-MM-DD");
    params.date_min = `${dateElements[0]}-01-01`;
  } else if (params.totalPeriodType === "custom_settings") {
    params.limit = 500;

    params.date_max = dayjs(params.date_max).format("YYYY-MM-DD");
    params.date_min = dayjs(params.date_min).format("YYYY-MM-DD");
  }

  return params;
};
