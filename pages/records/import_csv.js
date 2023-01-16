import { useEffect, useState } from "react";
import Head from "next/head";
import { useRecoilState, useRecoilValue } from "recoil";
import dayjs from "dayjs";

import Button from "../../components/atoms/button";
import SelectBox from "../../components/atoms/selectBox";
import { calcPerKmTime } from "./util";
import { storeRecord } from "../api/record";
import { userState } from "../../states/auth";
import { failureRowListState } from "../../states/record";

const importCsv = () => {
  const user = useRecoilValue(userState);
  const [csv, setCsv] = useState(null);
  const [header, setHeader] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const importColumns = [
    "-----",
    "date",
    "distance",
    "time",
    "per_time",
    "cal",
    "step",
  ];
  const requiredColumns = ["date", "distance", "time"];
  const [failureRowList, setFailureRowList] =
    useRecoilState(failureRowListState);
  let tmpFailureRowList = [];

  useEffect(() => {
    setFailureRowList([]);
  }, []);

  const fileSize = 1024 * 1024 * 4;

  const handleCsv = (e) => {
    setHeader(null);
    setCsv(null);

    const selected = document.getElementById("selectCsv").files[0];
    if (!selected) return;

    if (selected.size > fileSize) {
      selected.value = "";
      return alert("ファイルサイズは4MB以下にしてください");
    }
    const reader = new FileReader();
    reader.readAsText(selected);
    reader.onload = function (e) {
      const imported = e.target.result;
      const csvArr = imported.split(/\n/);
      const headerElement = csvArr[0].replace(/[\"]/g, "");
      const header = headerElement.split(",");
      setHeader(header);
      setCsv(csvArr);
    };
  };

  const handleSelect = (column, text) => {
    const targetIndex = selectedColumns.findIndex((item) => item.text === text);

    if (column === "-----" || targetIndex > -1) {
      selectedColumns.splice(targetIndex, 1);
      setSelectedColumns([...selectedColumns]);
      if (column === "-----") return;
    }

    const index = header.indexOf(text);

    let selected;
    if (column === "date") selected = { date: index, text: text };
    if (column === "distance") selected = { distance: index, text: text };
    if (column === "time") selected = { time: index, text: text };
    if (column === "per_time") selected = { per_time: index, text: text };
    if (column === "step") selected = { step: index, text: text };
    if (column === "cal") selected = { cal: index, text: text };

    setSelectedColumns([...selectedColumns, selected]);
  };

  const isSubmitDisabled = () => {
    if (selectedColumns.length < requiredColumns.length) return "disable";
    else if (selectedColumns.length === importColumns.length - 1) return "";
    else {
      if (selectedColumns.length >= requiredColumns.length) {
        const selectedRequired = selectedColumns.filter((column) =>
          requiredColumns.includes(Object.keys(column)[0])
        );

        if (selectedRequired.length === requiredColumns.length) return "";
        return "disabled";
      }
    }
  };

  const handleSubmit = async () => {
    csv.shift();
    const emptyRowDeleted = csv.filter((record) => record);

    let paramIndexObj = {};
    selectedColumns.map((item) => delete item.text);

    selectedColumns.forEach((item) => {
      paramIndexObj[Object.keys(item)[0]] = Object.values(item)[0];
    });

    for await (const [index, record] of emptyRowDeleted.entries()) {
      const recordColumnArr = record.split(",");

      if (
        !recordColumnArr[paramIndexObj?.date] ||
        !recordColumnArr[paramIndexObj?.distance] ||
        !recordColumnArr[paramIndexObj?.time]
      ) {
        tmpFailureRowList.push(index);
        continue;
      }

      const isCheckPerTime = recordColumnArr[paramIndexObj?.per_time]?.match(
        /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      );

      const params = {
        date: dayjs(recordColumnArr[paramIndexObj.date]).format("YYYY-MM-DD"),
        distance: Number(recordColumnArr[paramIndexObj.distance]),
        time: recordColumnArr[paramIndexObj.time],
        per_time: isCheckPerTime
          ? recordColumnArr[paramIndexObj?.per_time]
          : calcPerKmTime(
              recordColumnArr[paramIndexObj.time],
              Number(recordColumnArr[paramIndexObj.distance])
            ),
        step: Number(recordColumnArr[paramIndexObj?.step]) ?? 0,
        cal: Number(recordColumnArr[paramIndexObj?.cal]) ?? 0,
        user_id: user.id,
      };

      const res = await storeRecord(params);
      if (res.error) tmpFailureRowList.push(index);
    }

    setFailureRowList(tmpFailureRowList);
    setSelectedColumns([]);
  };

  return (
    <div className="w-full flexCol items-center">
      <Head>
        <title>CSVインポート</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pageTitle">CSVインポート</div>
      <div className="w-full flexCol items-center bg-white border-4">
        <div className="flex justify-center my-3">
          <input
            id="selectCsv"
            type="file"
            accept=".csv"
            onChange={(e) => handleCsv(e)}
          />
        </div>
        <div className="grid grid-cols-12 gap-3 content-center mb-3">
          {header &&
            header.map((item) => (
              <SelectBox
                key={item}
                label={item}
                selectableValues={importColumns}
                selectedValues={selectedColumns}
                handleSelect={handleSelect}
              />
            ))}
        </div>
        <Button
          text="実行"
          type="button"
          color="neutral"
          width="100px"
          height="35px"
          onClick={() => handleSubmit()}
          disabled={isSubmitDisabled()}
        />
        <div className="mt-3">
          {failureRowList.length > 0 && (
            <div className="flexCol justify-center text-center">
              <div>インポートに失敗したレコードの行番号</div>
              <div className="overflow-scroll">
                {failureRowList.map((row) => (
                  <span key={row}>{row + 2}, </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default importCsv;
