import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Head from "next/head";
import { Table } from "reactstrap";
import { useRouter } from "next/router";

import { myRecordListState } from "../../states/record";
import { getMyRecordList } from "../api/record";
import { userState } from "../../states/auth";
import EditRecordForm from "./editRecordForm";
import StoreRecordForm from "./storeRecordForm";

const recordList = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [flashMessage, setFlashMessage] = useState(null);
  const [myRecordList, setMyRecordList] = useRecoilState(myRecordListState);
  const [editRecord, setEditRecord] = useState(null);
  const [listStyle, setListStyle] = useState(null);

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

  useEffect(() => {
    if (editRecord && !router.query?.method)
      setListStyle("text-black bg-yellow-100");
    else if (editRecord && router.query?.method === "update")
      setListStyle("text-amber-600");
    else if (editRecord && router.query?.method === "store")
      setListStyle("text-blue-600");
    else setListStyle("text-black");
  }, [editRecord, router.query]);

  const handleSetRecord = (record) => {
    if (editRecord) {
      setEditRecord(null);
      setFlashMessage(null);
      router.query = null;
    } else {
      setFlashMessage(null);
      setEditRecord(record);
      router.query = {
        method: false,
        record_id: String(record.id),
      };
    }
  };

  return (
    <>
      <Head>
        <title>プロフィール</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flexCol items-center">
        <p className="pageTitle">記録一覧</p>
      </div>
      <div className="flex justify-center">
        {editRecord && !router.query?.method ? (
          <EditRecordForm
            record={editRecord}
            setEditRecord={setEditRecord}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
          />
        ) : (
          <StoreRecordForm
            setEditRecord={setEditRecord}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
          />
        )}
      </div>
      {myRecordList?.data.length > 0 && (
        <div className="border-4 border-gray-300">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
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
                  <tr
                    key={record.id}
                    onClick={() => {
                      handleSetRecord(record);
                    }}
                    className={editRecord?.id === record.id ? listStyle : ""}
                  >
                    <td>{record.id}</td>
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
