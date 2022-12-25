import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Head from "next/head";
import { Table } from "reactstrap";

import { myRecordListState } from "../../states/record";
import { getMyRecordList } from "../api/record";
import { userState } from "../../states/auth";
import FlashMessage from "../../components/messages/flashMessage";

const recordList = () => {
  const user = useRecoilValue(userState);
  const [flashMessage, setFlashMessage] = useState(null);
  const [myRecordList, setMyRecordList] = useRecoilState(myRecordListState);
  const [selectedRow, setSelectedRow] = useState(null);

  const getRecords = async () => {
    const res = await getMyRecordList(user.id);

    if (res.error) {
      return setFlashMessage({
        type: "error",
        message: "記録の取得に失敗しました",
      });
    }

    setMyRecordList(res);
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <>
      <Head>
        <title>プロフィール</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flexCol items-center">
        <p className="pageTitle">記録一覧</p>
        <FlashMessage flashMessage={flashMessage} />
      </div>
      {myRecordList?.data.length > 0 && (
        <div className="border-4 border-gray-300">
          <Table striped>
            <thead>
              <tr>
                <th>日付</th>
                <th>距離</th>
                <th>時間</th>
                <th>時間／km</th>
                <th>歩数</th>
              </tr>
            </thead>
            <tbody>
              {myRecordList?.data.length > 0 &&
                myRecordList.data.map((record) => (
                  <tr key={record.id} onClick={() => setSelectedRow(record.id)}>
                    <td>{record.date}</td>
                    <td>{record.distance} km</td>
                    <td>{record.time}</td>
                    <td>{record.per_time}</td>
                    <td>{record.step}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default recordList;
