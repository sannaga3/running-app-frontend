import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import FormError from "../../components/messages/formError";
import FlashMessage from "../../components/messages/flashMessage";
import { myRecordListState } from "../../states/record";
import { editRecord } from "../api/record";
import { calcPerKmTime } from "./util";

const editRecordForm = ({
  record,
  setEditRecord,
  flashMessage,
  setFlashMessage,
}) => {
  const router = useRouter();
  const [myRecordList, setMyRecordList] = useRecoilState(myRecordListState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      date: record.date,
      distance: record.distance,
      time: record.time,
      step: record.step,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    let [date, distance, time, step] = getValues([
      "date",
      "distance",
      "time",
      "step",
    ]);

    if (date.length === 0) date = record.date;
    if (distance.length === 0) distance = record.distance;
    if (time.length === 0) time = record.time;
    if (step.length === 0) step = record.step;

    const per_time = calcPerKmTime(time, distance);

    const params = {
      date: date,
      distance: distance,
      time: time,
      per_time: per_time,
      step: step,
      user_id: record.user_id,
    };

    const fetched = await editRecord(params, record.id);

    if (fetched?.error) {
      return setFlashMessage({
        type: "error",
        message: "記録の更新に失敗しました",
      });
    }

    const index = myRecordList.data.findIndex(
      (record) => record.id === fetched.data.id
    );
    const CopiedRecordList = structuredClone(myRecordList);
    CopiedRecordList.data.splice(index, 1, fetched.data);

    setMyRecordList(CopiedRecordList);

    router.push({
      pathname: `/records`,
      query: {
        method: "update",
        record_id: fetched.data.id,
      },
    });
  };

  return (
    <div className="w-3/4 flexCol items-center space-y-2 border-4 border-gray-300 mb-5 pt-2 relative">
      <FormError errors={errors} />
      <FlashMessage flashMessage={flashMessage} />
      <div className="flex space-x-5 font-weight-bold">
        <div className="w-[150px] text-center">日付</div>
        <div className="w-[150px] text-center">距離</div>
        <div className="w-[150px] text-center">時間</div>
        <div className="w-[150px] text-center">歩数</div>
        <div className="w-[150px] text-center"></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex space-x-5">
          <Input
            label="日付"
            name="date"
            type="date"
            register={register}
            isNotLabel={true}
            required={true}
            inputSize="150px"
          />
          <Input
            label="距離(km)"
            name="distance"
            type="number"
            step="0.1"
            min="0"
            register={register}
            isNotLabel={true}
            required={true}
            inputSize="150px"
          />
          <Input
            label="時間"
            name="time"
            type="time"
            step="1"
            register={register}
            isNotLabel={true}
            required={true}
            inputSize="150px"
          />
          <Input
            label="歩数"
            name="step"
            type="number"
            min="0"
            register={register}
            isNotLabel={true}
            required={true}
            inputSize="150px"
          />
          <Button
            text="更新"
            type="submit"
            color="amber"
            width="120px"
            height="35px"
          />
        </div>
      </form>
      <button
        type="button"
        onClick={() => {
          setEditRecord(null);
          setFlashMessage(null);
        }}
        className="text-red-500 text-3xl absolute -top-3 right-2 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

export default editRecordForm;
