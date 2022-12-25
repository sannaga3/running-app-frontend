import Cookies from "js-cookie";
import { calcPerKmTime } from "../records/util";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyRecordList = async (userId) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${API_URL}/api/records?filters[user_id][$eq]=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.ok) {
    let recordList = await res.json();

    const convertedList = recordList.data.map((record) => {
      let converted = record.attributes;

      converted.id = record.id;
      converted.time = converted.time.replace(".000", "");
      delete converted.createdAt;
      delete converted.publishedAt;
      delete converted.updatedAt;

      const per_time = calcPerKmTime(converted.time, converted.distance);
      converted.per_time = per_time;

      return converted;
    });

    recordList.data = convertedList;

    return recordList;
  }

  return { error: true };
};
