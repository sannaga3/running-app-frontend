import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";

import TotalDataList from "./totalDataList";
import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import FormError from "../../components/messages/formError";
import RadioButton from "../../components/atoms/radioButton";
import CheckBox from "../../components/atoms/checkBox";
import {
  recordTotalFormState,
  defaultTotalFormState,
  totalResultState,
  totalRecordListState,
} from "../../states/record";
import { getMyTotalRecordList } from "../api/record";
import { userState } from "../../states/auth";

const totalRecordForm = () => {
  const user = useRecoilValue(userState);
  const [totalResult, setTotalResult] = useRecoilState(totalResultState);
  const [totalRecordList, setTotalRecordList] =
    useRecoilState(totalRecordListState);
  const [formValues, setFormValues] = useRecoilState(recordTotalFormState);
  const selectable = [
    {
      label: "1ヶ月",
      value: "per_month",
    },
    {
      label: "1年",
      value: "per_year",
    },
    {
      label: "自分で設定",
      value: "custom_settings",
    },
  ];
  const [totalType, setTotalType] = useState(
    formValues.totalPeriodType ?? "per_month"
  );

  const checkableTargetColumns = [
    {
      label: "距離",
      value: "distance",
    },
    {
      label: "時間",
      value: "time",
    },
    {
      label: "時間／km",
      value: "per_time",
    },
    {
      label: "歩数",
      value: "step",
    },
    {
      label: "cal",
      value: "cal",
    },
  ];
  const [targetColumns, setTargetColumns] = useState(
    formValues.targetColumns ?? []
  );

  const checkableOptions = [
    {
      label: "合計",
      value: "total",
    },
    {
      label: "平均",
      value: "average",
    },
    {
      label: "最大",
      value: "max",
    },
    {
      label: "最小",
      value: "min",
    },
  ];
  const [options, setOptions] = useState(formValues.options ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      ...formValues,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    let [totalPeriodType, date_min, date_max, targetColumns, options, limit] =
      getValues([
        "totalPeriodType",
        "date_min",
        "date_max",
        "targetColumns",
        "options",
        "limit",
      ]);

    const newFormValue = {
      totalPeriodType: totalPeriodType,
      date_max: date_max,
      date_min: date_min,
      targetColumns: targetColumns,
      options: options,
      limit: limit,
      userId: user.id,
    };

    setFormValues(newFormValue);

    const totalResult = await getMyTotalRecordList(newFormValue);

    setTotalResult(totalResult);
    setTotalRecordList(totalResult.targetRecords);
  };

  return (
    <>
      <div className="relative w-full flexCol items-center border-2 border-gray-700 rounded-xl mb-5 pt-2 z-0">
        <div className="pageSecondTitle mb-2">検索</div>
        <FormError errors={errors} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flexCol items-center">
            <div className="flex space-x-5 font-weight-bold mb-2">
              <div className="w-[150px] text-left">集計タイプ</div>
              <div className="w-[450px] text-left">
                <RadioButton
                  name="totalPeriodType"
                  register={register}
                  selectable={selectable}
                  selected={totalType}
                  setSelected={setTotalType}
                />
              </div>
            </div>
            <div className="flex content-center space-x-5">
              <div className="w-[150px] font-weight-bold mt-2 ml-1">日付</div>
              {totalType === "custom_settings" ? (
                <div className="w-[450px] flex space-x-5">
                  <Input
                    label="日付"
                    name="date_min"
                    type="date"
                    register={register}
                    isNotLabel={true}
                    required={true}
                    inputSize="150px"
                  />
                  <div className="pt-1">~</div>
                  <Input
                    label="日付"
                    name="date_max"
                    type="date"
                    register={register}
                    isNotLabel={true}
                    required={true}
                    inputSize="150px"
                  />
                </div>
              ) : (
                <>
                  <div className="w-[450px] flex space-x-5">
                    <Input
                      label="日付"
                      name="date_min"
                      type="date"
                      register={register}
                      isNotLabel={true}
                      required={true}
                      inputSize="150px"
                    />
                    <span className="text-xs text-red-500 pt-2">
                      * 対象期間に含まれる日付を選択してください
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-start space-x-5 font-weight-bold mt-1">
              <div className="w-[150px] text-left">対象カラム</div>
              <div className="w-[450px] text-left">
                <CheckBox
                  name="targetColumns"
                  register={register}
                  checkable={checkableTargetColumns}
                  selected={targetColumns}
                  setSelected={setTargetColumns}
                />
              </div>
            </div>
            <div className="flex justify-start space-x-5 font-weight-bold mt-3 mb-2">
              <div className="w-[150px] text-left">集計オプション</div>
              <div className="w-[450px] text-left">
                <CheckBox
                  name="options"
                  register={register}
                  checkable={checkableOptions}
                  selected={options}
                  setSelected={setOptions}
                />
              </div>
            </div>
            <div className="space-x-5 mt-2 mb-3">
              <Button
                text="検索"
                type="submit"
                color="primary"
                width="100px"
                height="35px"
              />
            </div>
          </div>
        </form>
        <Button
          text="条件リセット"
          type="button"
          color="primary"
          width="100px"
          height="30px"
          classProps="absolute border-2 top-2 right-2 border-gray-500 rounded-full text-xs font-weight-bold focus:outline-none hover:scale-105"
          useDefaultClass={false}
          onClick={() => {
            reset();
            setFormValues({ ...defaultTotalFormState });
          }}
        />
      </div>
      {totalResult?.dataArr?.length > 0 && (
        <TotalDataList
          totalRecordList={totalRecordList}
          dataArr={totalResult.dataArr}
          checkableTargetColumns={checkableTargetColumns}
        />
      )}
    </>
  );
};
export default totalRecordForm;
