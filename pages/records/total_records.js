import Head from "next/head";
import { useRecoilValue } from "recoil";

import TotalRecordForm from "./totalRecordForm";
import TotalResult from "./totalResult";
import { totalResultState, totalRecordListState } from "../../states/record";

const total_records = () => {
  const totalResult = useRecoilValue(totalResultState);
  const totalRecordList = useRecoilValue(totalRecordListState);

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

  return (
    <>
      <Head>
        <title>記録集計</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pageTitle">記録集計</div>
      <div className="absolute top-0 right-0"></div>
      <TotalRecordForm checkableTargetColumns={checkableTargetColumns} />
      {totalResult?.dataArr?.length > 0 && (
        <TotalResult
          totalRecordList={totalRecordList}
          dataArr={totalResult.dataArr}
          checkableTargetColumns={checkableTargetColumns}
        />
      )}
    </>
  );
};

export default total_records;
