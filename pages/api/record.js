import Cookies from "js-cookie";

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
      : `${API_URL}/api/records?filters[user_id][$eq]=${userId}&pagination[page]=${meta.page}&pagination[pageSize]=${meta.pageSize}${searchQuery}`;

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

    recordList.data = convertedList.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

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
