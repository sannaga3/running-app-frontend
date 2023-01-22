// 1kmあたりの時間を算出する
export const calcPerKmTime = (time, distance) => {
  if (time === "00:00:00") return "00:00:00";

  // 時間を「時・分・秒」の配列に変換 00:02:20 => ['00','02','20']
  const timeArr = time.split(":");

  // 時間を秒に変換
  const timeConvertedSecond =
    Number(timeArr[0]) * 3600 + Number(timeArr[1]) * 60 + Number(timeArr[2]);

  // 1kmあたりの距離を算出(秒)
  const perKmTimeSecond = timeConvertedSecond / distance;

  // 秒から時間に変換
  let hour = Math.floor(perKmTimeSecond / 3600).toString();
  let remainderMinute = perKmTimeSecond % 3600;
  let minute = Math.floor(remainderMinute / 60).toString();
  let remainderSecond = Math.floor(remainderMinute % 60).toString();

  // 時・分・秒が1桁だった場合0パディングで2桁にする
  if (hour.length === 1) hour = hour.padStart(2, "0");
  if (minute.length === 1) minute = minute.padStart(2, "0");
  if (remainderSecond.length === 1)
    remainderSecond = remainderSecond.padStart(2, "0");

  // 算出結果 ['00','01','10']
  const perKmTime = `${hour}:${minute}:${remainderSecond}`;

  return perKmTime;
};

// 複数条件での並び替え
export const sortRecord = (recordList, sortParams) => {
  recordList.sort((a, b) => {
    for (const param of sortParams) {
      if (param.name === "id") {
        if (param.sort === "asc") return a.id > b.id ? 1 : -1;
        if (param.sort === "desc") return a.id < b.id ? 1 : -1;
      }
      if (param.name === "date") {
        if (param.sort === "asc")
          return new Date(a.date) - new Date(b.date) ? -1 : 1;
        if (param.sort === "desc")
          return new Date(a.date) - new Date(b.date) ? 1 : -1;
      }
      if (param.name === "distance") {
        if (param.sort === "asc") return a.distance > b.distance ? 1 : -1;
        if (param.sort === "desc") return a.distance < b.distance ? 1 : -1;
      }
      if (param.name === "time") {
        if (param.sort === "asc") return a.time.localeCompare(b.time);
        if (param.sort === "desc") return b.time.localeCompare(a.time);
      }
      if (param.name === "per_time") {
        if (param.sort === "asc") return a.per_time.localeCompare(b.per_time);
        if (param.sort === "desc") return b.per_time.localeCompare(a.per_time);
      }
      if (param.name === "step") {
        if (param.sort === "asc") return a.step > b.step ? 1 : -1;
        if (param.sort === "desc") return a.step < b.step ? 1 : -1;
      }
      if (param.name === "cal") {
        if (param.sort === "asc") return a.cal > b.cal ? 1 : -1;
        if (param.sort === "desc") return a.cal < b.cal ? 1 : -1;
      }
    }
  });

  return recordList;
};
