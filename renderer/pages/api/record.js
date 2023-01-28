import Cookies from "js-cookie";
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

  const params = {
    sortParams: sortParams,
    searchParams: searchParams,
    userId: userId,
    meta: meta,
  };

  const res = await fetch(`${API_URL}/api/records/findMyRecords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...params }),
  });

  if (res.ok) {
    let recordList = await res.json();

    const convertedList = recordList.results.map((record) => {
      let converted = { ...record };
      converted.time = converted.time.replace(".000", "");
      converted.per_time = converted.per_time.replace(".000", "");
      return converted;
    });

    recordList.results = convertedList;

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
