import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Head from "next/head";
import { Table } from "reactstrap";
import { useRouter } from "next/router";

import { myRecordListState } from "../../states/record";
import { destroyRecord, getMyRecordList } from "../api/record";
import { userState } from "../../states/auth";
import EditRecordForm from "./editRecordForm";
import StoreRecordForm from "./storeRecordForm";
import Button from "../../components/atoms/button";

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

  const deleteRecord = async (recordId) => {
    if (window.confirm("記録を削除しますか？")) {
      const res = await destroyRecord(recordId);

      if (res.ok) {
        const index = myRecordList.data.findIndex(
          (record) => record.id === res.id
        );
        const CopiedRecordList = structuredClone(myRecordList);
        CopiedRecordList.data.splice(index, 1);

        setMyRecordList(CopiedRecordList);
        setEditRecord(null);

        setFlashMessage({
          type: "success",
          message: "レコードを削除しました",
        });
      } else {
        setFlashMessage({
          type: "error",
          message: "レコードの削除に失敗しました",
        });
      }
    }
  };
  return (
    <div className="relative z-0">
      <Head>
        <title>記録一覧</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-0 right-0">
        <Button
          text="インポート"
          type="button"
          color="neutral"
          width="100px"
          height="35px"
          onClick={() =>
            router.push({
              pathname: `/records/import_csv`,
            })
          }
        />
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
                <th></th>
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
                    <td className="align-middle">{record.id}</td>
                    <td className="align-middle">{record.date}</td>
                    <td className="align-middle">{record.distance} km</td>
                    <td className="align-middle">{record.time}</td>
                    <td className="align-middle">{record.per_time}</td>
                    <td className="align-middle">{record.step}</td>
                    <td className="w-16 px-0">
                      <Button
                        text="削除"
                        type="submit"
                        width="40px"
                        textSize="sm"
                        onClick={() => deleteRecord(record.id)}
                        useDefaultClass={false}
                        classProps="text-rose-500 font-weight-bold align-middle mr-4 hover:scale-110 focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default recordList;
