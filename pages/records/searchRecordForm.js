import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import FormError from "../../components/messages/formError";
import { recordSearchState, searchDefaultState } from "../../states/record";

const searchRecordForm = ({ isSearchModal, setIsSearchModal }) => {
  const [formValues, setFormValues] = useRecoilState(recordSearchState);

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
    let [
      date_min,
      date_max,
      distance_min,
      distance_max,
      time_min,
      time_max,
      per_time_min,
      per_time_max,
      step_min,
      step_max,
      cal_min,
      cal_max,
    ] = getValues([
      "date_min",
      "date_max",
      "distance_min",
      "distance_max",
      "time_min",
      "time_max",
      "per_time_min",
      "per_time_max",
      "step_min",
      "step_max",
      "cal_min",
      "cal_max",
    ]);

    if (date_min === "") date_min = null;
    if (date_max === "") date_max = null;

    const newFormValue = {
      date_min: date_min,
      date_max: date_max,
      distance_min: distance_min ? Number(distance_min) : null,
      distance_max: distance_max ? Number(distance_max) : null,
      time_min: time_min,
      time_max: time_max,
      per_time_min: per_time_min,
      per_time_max: per_time_max,
      step_min: step_min ? Number(step_min) : null,
      step_max: step_max ? Number(step_max) : null,
      cal_min: cal_min ? Number(cal_min) : null,
      cal_max: cal_max ? Number(cal_max) : null,
    };

    setFormValues(newFormValue);
  };

  return (
    <>
      {isSearchModal ? (
        <div className="relative w-full flexCol items-center space-y-2 border-2 border-gray-700 rounded-xl mb-5 pt-2 z-0">
          <div className="pageSecondTitle mb-2">検索</div>
          <FormError errors={errors} />
          <div className="flex space-x-5 font-bold">
            <div className="w-[50px] text-center"></div>
            <div className="w-[150px] text-center">日付</div>
            <div className="w-[100px] text-center">距離</div>
            <div className="w-[150px] text-center">時間</div>
            <div className="w-[150px] text-center">距離/km</div>
            <div className="w-[100px] text-center">歩数</div>
            <div className="w-[100px] text-center">cal</div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flexCol items-center">
              <div className="flex content-center space-x-5">
                <div className="w-[50px] text-lg font-bold mt-1 ml-1">min</div>
                <Input
                  label="日付"
                  name="date_min"
                  type="date"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="距離/km"
                  name="distance_min"
                  type="number"
                  step="0.01"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
                <Input
                  label="時間"
                  name="time_min"
                  type="time"
                  step="1"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="時間／km"
                  name="per_time_min"
                  type="time"
                  step="1"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="歩数"
                  name="step_min"
                  type="number"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
                <Input
                  label="cal"
                  name="cal_min"
                  type="number"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
              </div>
              <div className="flex content-center space-x-5">
                <div className="w-[50px] text-lg font-bold mt-1">max</div>
                <Input
                  label="日付"
                  name="date_max"
                  type="date"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="距離/km"
                  name="distance_max"
                  type="number"
                  step="0.01"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
                <Input
                  label="時間"
                  name="time_max"
                  type="time"
                  step="1"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="時間／km"
                  name="per_time_max"
                  type="time"
                  step="1"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="150px"
                />
                <Input
                  label="歩数"
                  name="step_max"
                  type="number"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
                <Input
                  label="cal"
                  name="cal_max"
                  type="number"
                  min="0"
                  register={register}
                  isNotLabel={true}
                  required={false}
                  inputSize="100px"
                />
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
            classProps="absolute border-2 top-0 right-12 border-gray-500 rounded-full text-xs font-bold focus:outline-none hover:scale-105"
            useDefaultClass={false}
            onClick={() => {
              reset();
              setFormValues({ ...searchDefaultState });
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsSearchModal(false);
            }}
            className="absolute -top-3 right-2 text-red-500 text-3xl focus:outline-none z-10"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full flexCol items-center space-y-2 border-2 border-gray-700 rounded-xl mb-5 z-0">
            <div className="text-md font-bold">検索</div>
            <button
              type="button"
              onClick={() => {
                setIsSearchModal(true);
              }}
              className="absolute -top-3 right-2 text-xl text-green-500 focus:outline-none z-10"
            >
              ×
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default searchRecordForm;
