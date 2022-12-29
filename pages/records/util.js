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
