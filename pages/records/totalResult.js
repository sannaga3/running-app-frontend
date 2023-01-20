import { useState } from "react";
import { useRecoilValue } from "recoil";

import SelectBox from "../../components/atoms/selectBox";
import { sortRecord } from "./util";
import { recordTotalFormState } from "../../states/record";
import TotalResultRecords from "./totalResultRecords";
import TotalResultGraph from "./totalResultGraph";

const totalResult = ({ totalRecordList, dataArr, checkableTargetColumns }) => {
  const formValues = useRecoilValue(recordTotalFormState);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [limit, setLimit] = useState(5);
  const [displayFormat, setDisplayFormat] = useState("リスト");
  let recordColumns;
  let selectedList;

  const totalTableStyle =
    "w-[150px] text-right font-weight-bold border-dashed border-b-2 border-gray-600";

  const selectBoxStyle =
    "w-full h-6 text-center border-2 border-gray-700 rounded-lg focus:outline-none";

  const convertHeader = (key) => {
    let converted;
    if (key === "totalValues") converted = "合計値";
    if (key === "maxValues") converted = "最大値";
    if (key === "minValues") converted = "最小値";
    if (key === "averageValues") converted = "平均値";

    return converted;
  };

  const convertValue = (value, index) => {
    if (value === null) return;

    const converted = index === 0 ? `${value} km` : value;

    return (
      <div className="w-[150px] text-right border-dashed border-b-2 border-gray-600">
        {converted}
      </div>
    );
  };

  const convertColumnValue = (value) => {
    const target = checkableTargetColumns.find(
      (column) => column.value === value
    );
    return target && target?.label;
  };

  const handleSelectLimit = (number) => {
    setLimit(number);
  };

  const handleSelectDisplayFormat = (format) => {
    setDisplayFormat(format);
  };

  if (selectedColumn && selectedOption) {
    const copiedList = [...totalRecordList];
    const sort = selectedOption === "maxValues" ? "desc" : "asc";
    const sortParam = { name: selectedColumn, sort: sort };

    const sortedList = sortRecord(copiedList, [sortParam]);
    selectedList = sortedList.slice(0, limit);

    recordColumns = Object.keys(selectedList[0]).map((value) => {
      const target = checkableTargetColumns.find(
        (column) => column.value === value
      );
      return target ?? null;
    });
    recordColumns = recordColumns.filter((item) => item !== null);
  }

  return (
    <div className="flexCol items-center border-2 border-gray-700 rounded-xl mb-5 pt-2">
      <div className="text-xl font-weight-bold my-2">集計結果</div>
      <div className="flex justify-center items-center space-x-10 mb-3">
        <div className="flexCol items-center mb-3">
          <div className="text-xl font-weight-bold my-2">期間</div>
          <div className="flex space-x-7 items-center text-lg border-dashed border-b-2 border-gray-600">
            <div>{totalRecordList[0].date}</div>
            <div>~</div>
            <div>{totalRecordList[totalRecordList.length - 1].date}</div>
          </div>
          <div className="w-full flex justify-around text-lg text-left mt-3 border-dashed border-b-2 border-gray-600">
            <div>集計数 :</div>
            <div>{totalRecordList.length} 回</div>
          </div>
        </div>
        <div className="flex items-center p-2">
          <div className="flexCol items-center space-y-3 mb-5 mt-3">
            <div className={`${totalTableStyle} text-white`}>カラム</div>
            {formValues.targetColumns.map((column) => (
              <div className={`${totalTableStyle}`} key={column}>
                {convertColumnValue(column)}
                <input
                  type="radio"
                  name="selectedColumn"
                  value={column}
                  onChange={() => setSelectedColumn(column)}
                  className="ml-2"
                />
              </div>
            ))}
          </div>
          {dataArr.map((data) => (
            <div
              key={data.key}
              className="flexCol items-center space-y-3 mb-5 mt-3"
            >
              <div className={`${totalTableStyle}`}>
                {convertHeader(Object.keys(data)[0])}
                {Object.keys(data)[0] !== "totalValues" &&
                  Object.keys(data)[0] !== "averageValues" && (
                    <input
                      type="radio"
                      name="selectedOption"
                      value={Object.keys(data)[0]}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="ml-2"
                    />
                  )}
              </div>
              {Object.values(data)[0].map((value, index) => (
                <div key={index}>{convertValue(value, index)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xl font-weight-bold mb-3">集計詳細</div>
      <div className="flex space-x-5 mb-3">
        <div className="w-[200px] border-b-2 border-gray-600">
          <span className="font-weight-bold mr-3 pb-1">対象カラム:</span>
          {convertColumnValue(selectedColumn) ?? "未選択"}
        </div>
        <div className="w-[200px]  border-b-2 border-gray-600">
          <span className="font-weight-bold mr-3 pb-1">対象オプション:</span>
          {convertHeader(selectedOption) ?? "未選択"}
        </div>
        <div className="flex space-x-3 border-b-2 border-gray-600 pb-1">
          <span>表示数:</span>
          <SelectBox
            name="limit"
            selectableValues={[1, 2, 3, 5, 15, 31]}
            selectedValue={limit}
            handleSelect={handleSelectLimit}
            wrapperStyleProp="w-[80px]"
            labelStyleProp=""
            selectStyleProp={`${selectBoxStyle}`}
          />
        </div>
        <div className="flex space-x-3 border-b-2 border-gray-600 pb-1">
          <span>表示形式:</span>
          <SelectBox
            name="displayFormat"
            selectableValues={["リスト", "グラフ"]}
            selectedValue={displayFormat}
            handleSelect={handleSelectDisplayFormat}
            wrapperStyleProp="w-[80px]"
            labelStyleProp=""
            selectStyleProp={`${selectBoxStyle} text-sm`}
          />
        </div>
      </div>
      <div>
        {selectedColumn && selectedOption && (
          <>
            {displayFormat === "リスト" ? (
              <TotalResultRecords
                columns={recordColumns}
                records={selectedList}
                selectedColumn={selectedColumn}
              />
            ) : (
              <>
                {selectedColumn !== "time" && selectedColumn !== "per_time" ? (
                  <div className="mt-3">
                    <TotalResultGraph
                      records={selectedList}
                      selectedColumn={selectedColumn}
                    />
                  </div>
                ) : (
                  <div
                    style={{ width: "800px", height: "400px" }}
                    className="text-3xl text-center flexCol justify-center"
                  >
                    <div>グラフ表示できません</div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default totalResult;
