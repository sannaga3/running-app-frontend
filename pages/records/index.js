import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Head from "next/head";
import { Table } from "reactstrap";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

import {
  myRecordListState,
  recordSortState,
  recordSearchState,
} from "../../states/record";
import { destroyRecord, getMyRecordList } from "../api/record";
import { userState } from "../../states/auth";
import EditRecordForm from "./editRecordForm";
import StoreRecordForm from "./storeRecordForm";
import SearchRecordForm from "./searchRecordForm";
import Button from "../../components/atoms/button";
import SelectBox from "../../components/atoms/selectBox";
import SortButton from "../../components/atoms/sortButton";

const recordList = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [flashMessage, setFlashMessage] = useState(null);
  const [myRecordList, setMyRecordList] = useRecoilState(myRecordListState);
  const [editRecord, setEditRecord] = useState(null);
  const [listStyle, setListStyle] = useState(null);
  const [selectedValue] = useState(25);
  const [sortItems, setSortItems] = useRecoilState(recordSortState);
  const [isSearchModal, setIsSearchModal] = useState(false);
  const searchFormValues = useRecoilValue(recordSearchState);
  const linkStyle = "w-5 mx-2 px-3 rounded-full text-white";

  const getRecords = async (meta) => {
    const sortable = sortItems.filter((item) => item.sort !== null);

    const formValuesArr = Object.entries(searchFormValues).map(
      ([key, value]) => ({
        key,
        value,
      })
    );

    const existValueParams = formValuesArr.filter(
      (item) => item.value !== null
    );

    const res = await getMyRecordList(
      user.id,
      meta,
      sortable,
      existValueParams
    );

    if (res.error) {
      return setFlashMessage({
        type: "error",
        message: "記録の取得に失敗しました",
      });
    }

    setMyRecordList(res);
  };

  useEffect(() => {
    getRecords({
      page: 1,
      pageSize: myRecordList.meta.pagination.pageSize,
    });
  }, [searchFormValues]);

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

  const pageChange = (pageData) => {
    const pageNumber = pageData["selected"] + 1;
    const meta = {
      page: pageNumber,
      pageSize: myRecordList.meta.pagination.pageSize,
    };
    getRecords(meta);
  };

  const handleSelect = (pageSize) => {
    const meta = {
      page: 1,
      pageSize: pageSize,
    };
    getRecords(meta, sortItems);
  };

  return (
    <div className="relative z-0">
      <Head>
        <title>記録一覧</title>
        <meta name="description" content="user profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pageTitle">記録一覧</div>
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
      <div className="flex justify-center">
        <SearchRecordForm
          isSearchModal={isSearchModal}
          setIsSearchModal={setIsSearchModal}
        />
      </div>

      <div className="flex justify-center relative mb-2">
        <ReactPaginate
          pageCount={Math.ceil(
            myRecordList.meta.pagination.total /
              myRecordList.meta.pagination.pageSize
          )}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={(e) => pageChange(e)}
          // コンテナ
          containerClassName="w-1/3 h-10 flex justify-center items-center rounded-full mb-3"
          // ページ番号
          pageClassName=""
          pageLinkClassName={`${linkStyle} bg-gray-700 py-1`}
          activeClassName="font-weight-bold"
          activeLinkClassName={`${linkStyle} bg-gray-700 py-1 font-weight-bold text-xl scale-110`}
          // 次・前
          previousClassName="mb-0.5"
          nextClassName="mb-0.5"
          previousLabel={"<"}
          previousLinkClassName={`${linkStyle} bg-gray-700 text-center pb-1`}
          nextLabel={">"}
          nextLinkClassName={`${linkStyle} bg-gray-700 text-center pb-1`}
          // その他
          disabledClassName="disabled" //先頭 or 末尾の設定
          breakLabel="..." // 数値を表示しない部分
          breakClassName="mb-0.5"
          breakLinkClassName={`${linkStyle} bg-gray-700 pb-1`}
        />
        <div className="absolute -top-7 right-0">
          <SelectBox
            header={["表示数"]}
            importColumns={[10, 25, 50, 100]}
            handleSelect={handleSelect}
            selectedValue={selectedValue}
            wrapperStyleProp="w-24 text-md"
            labelStyleProp="w-full h-8 bg-gray-700 text-white text-center rounded-t-lg pt-1"
            selectStyleProp="w-full h-8 text-center border-2 border-gray-700 rounded-b-lg focus:outline-none"
            optionStyleProp=""
          />
        </div>
        <div className="absolute right-32 flex items-end">
          <div className="mr-2 font-weight-bold">並替えリセット</div>
          <div
            className="w-4 h-7 text-xs text-center border-2 border-black rounded-full cursor-pointer pt-1 hover:scale-110"
            onClick={() =>
              setSortItems([
                { name: "id", sort: null },
                { name: "date", sort: "desc" },
                { name: "distance", sort: null },
                { name: "time", sort: null },
                { name: "per_time", sort: null },
                { name: "step", sort: null },
                { name: "cal", sort: null },
              ])
            }
          ></div>
        </div>
      </div>
      {myRecordList?.data.length > 0 && (
        <div className="border-4 border-gray-400 rounded-xl">
          <Table>
            <thead className="border-b-4 border-gray-400 rounded-xl">
              <tr>
                <th>
                  ID
                  <SortButton
                    column="id"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  日付
                  <SortButton
                    column="date"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  距離
                  <SortButton
                    column="distance"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  時間
                  <SortButton
                    column="time"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  時間／km
                  <SortButton
                    column="per_time"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  歩数
                  <SortButton
                    column="step"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
                <th>
                  cal
                  <SortButton
                    column="cal"
                    sortItems={sortItems}
                    setSortItems={setSortItems}
                  />
                </th>
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
                    <td className="align-middle">{record.cal}</td>
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
