import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import FormError from "../../components/messages/formError";
import FlashMessage from "../../components/messages/flashMessage";
import { userState } from "../../states/auth";
import { myRecordListState } from "../../states/record";
import { storeRecord } from "../api/record";
import { calcPerKmTime } from "./util";
import dayjs from "dayjs";

const storeRecordForm = ({ setEditRecord, flashMessage, setFlashMessage }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [myRecordList, setMyRecordList] = useRecoilState(myRecordListState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"),
      distance: 0,
      time: "00:00:00",
      step: 0,
      cal: 0,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async () => {
    let [date, distance, time, step, cal] = getValues([
      "date",
      "distance",
      "time",
      "step",
      "cal",
    ]);

    const per_time = calcPerKmTime(time, distance);

    const params = {
      date: date,
      distance: Number(distance),
      time: time,
      per_time: per_time,
      step: Number(step),
      cal: Number(cal),
      user_id: user.id,
    };

    const fetched = await storeRecord(params);

    if (fetched.error) {
      return setFlashMessage({
        type: "error",
        message: "記録の作成に失敗しました",
      });
    }

    let CopiedRecordList = structuredClone(myRecordList);
    CopiedRecordList.data.push(fetched.data);
    CopiedRecordList.data.sort((a, b) => new Date(b.date) - new Date(a.date));

    setMyRecordList(CopiedRecordList);
    setEditRecord(fetched.data);
    setFlashMessage(null);
    reset();

    router.push({
      pathname: `/records`,
      query: {
        method: "store",
        record_id: fetched.data.id,
      },
    });
  };

  return (
    <div className="relative w-3/4 flexCol items-center space-y-2 border-2 border-gray-700 rounded-xl mb-5 pt-2">
      <FlashMessage flashMessage={flashMessage} />
      <FormError errors={errors} />
      <div className="flex space-x-5 font-bold">
        <div className="w-[150px] text-center">日付</div>
        <div className="w-[100px] text-center">距離</div>
        <div className="w-[150px] text-center">時間</div>
        <div className="w-[100px] text-center">歩数</div>
        <div className="w-[100px] text-center">cal</div>
        <div className="w-[100px] text-center"></div>
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
            min="0"
            step="0.01"
            register={register}
            isNotLabel={true}
            required={true}
            inputSize="100px"
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
            required={false}
            inputSize="100px"
          />
          <Input
            label="cal"
            name="cal"
            type="number"
            min="0"
            register={register}
            isNotLabel={true}
            required={false}
            inputSize="100px"
          />
          <Button
            text="作成"
            type="submit"
            color="primary"
            width="100px"
            height="35px"
          />
        </div>
      </form>
    </div>
  );
};

export default storeRecordForm;
