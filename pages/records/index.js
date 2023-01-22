import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

import {
  myRecordListState,
  recordSortState,
  recordSearchState,
  sortDefaultState,
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
  const [selectedPageSize] = useState(
    myRecordList.meta.pagination.pageSize ?? 25
  );
  const [sortItems, setSortItems] = useRecoilState(recordSortState);
  const [isSearchModal, setIsSearchModal] = useState(false);
  const searchFormValues = useRecoilValue(recordSearchState);
  const linkStyle = "w-5 mx-2 px-3 rounded-full text-white";
  const tableRowStyle = "flex h-12 justify-between items-center";
  const resetButtonStyle =
    "w-4 h-7 text-xs text-center border-2 border-black rounded-full cursor-pointer pt-1 hover:scale-110";

  const getRecords = async (meta) => {
    const existSortParams = sortItems.filter((item) => item.sort !== null);

    const formValuesArr = Object.entries(searchFormValues).map(
      ([key, value]) => ({
        key,
        value,
      })
    );

    const existSearchParams = formValuesArr.filter(
      (item) => item.value !== null && item.value !== ""
    );

    const res = await getMyRecordList(
      user.id,
      meta,
      existSortParams,
      existSearchParams
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
      pageSize:
        myRecordList.length > 0 ? myRecordList.meta.pagination.pageSize : 25,
    });
  }, [sortItems, searchFormValues]);

  useEffect(() => {
    if (editRecord && !router.query?.method)
      setListStyle("text-black bg-white");
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

  const handleSelect = (e) => {
    const meta = {
      page: 1,
      pageSize: Number(e),
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
          text="インポートCSV"
          type="button"
          color="gray"
          width="150px"
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
      <div className="flex justify-center mb-5">
        <div className="w-4/5">
          <SearchRecordForm
            isSearchModal={isSearchModal}
            setIsSearchModal={setIsSearchModal}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex justify-center w-4/5 relative mb-2">
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
            activeClassName="font-bold"
            activeLinkClassName={`${linkStyle} bg-gray-700 py-1 font-bold text-xl scale-110`}
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
              label={["表示数"]}
              selectableValues={[10, 25, 50, 100, 150, 300, 500]}
              handleSelect={handleSelect}
              selectedValue={selectedPageSize}
              wrapperStyleProp="w-24 text-md"
              labelStyleProp="w-full h-8 bg-gray-700 text-white text-center rounded-t-lg pt-1"
              selectStyleProp="w-full h-8 text-center bg-gray-300 border-2 border-gray-700 rounded-b-lg focus:outline-none"
            />
          </div>
          <div className="absolute right-32 flex items-end">
            <div className="mr-2 font-bold">並替えリセット</div>
            <div
              className={`${resetButtonStyle}`}
              onClick={() => setSortItems(sortDefaultState)}
            ></div>
          </div>
        </div>
      </div>
      <div className="flexCol items-center">
        {myRecordList?.data.length > 0 && (
          <div className="w-4/5 border-2 border-gray-700 rounded-xl relative">
            <div>
              <div className="border-b-2 border-gray-700">
                <div className="h-12 flex justify-between items-center font-bold">
                  <div className="w-24 pl-5 flex justify-start items-center">
                    ID
                    <SortButton
                      column="id"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-32 px-2 flex justify-start items-center">
                    日付
                    <SortButton
                      column="date"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-28 px-2 flex justify-start items-center">
                    距離
                    <SortButton
                      column="distance"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-28 px-2 flex justify-start items-center">
                    時間
                    <SortButton
                      column="time"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-36 px-2 flex justify-start items-center">
                    時間／km
                    <SortButton
                      column="per_time"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-24 px-2 flex justify-start items-center">
                    歩数
                    <SortButton
                      column="step"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-20 pr-5 flex justify-start items-center">
                    cal
                    <SortButton
                      column="cal"
                      sortItems={sortItems}
                      setSortItems={setSortItems}
                    />
                  </div>
                  <div className="w-20 flex justify-start mr-4">
                    <Button
                      text="集計"
                      type="button"
                      color="gray"
                      width="80px"
                      height="35px"
                      onClick={() =>
                        router.push({
                          pathname: `/records/total_records`,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                {myRecordList?.data.length > 0 &&
                  myRecordList.data.map((record, index) => (
                    <div
                      key={record.id}
                      onClick={() => {
                        handleSetRecord(record);
                      }}
                      className={
                        editRecord?.id === record.id
                          ? `${tableRowStyle} ${listStyle} border-b-2 border-gray-700`
                          : index + 1 === myRecordList.data.length
                          ? tableRowStyle
                          : `${tableRowStyle} border-b-2 border-gray-700`
                      }
                    >
                      <div className="w-24 pl-5 text-left">{record.id}</div>
                      <div className="w-32 text-left">{record.date}</div>
                      <div className="w-28 text-left">{record.distance} km</div>
                      <div className="w-28 text-left">{record.time}</div>
                      <div className="w-36 text-left">{record.per_time}</div>
                      <div className="w-24 text-left">{record.step}</div>
                      <div className="w-20 text-left">{record.cal}</div>
                      <div className="w-20">
                        <Button
                          text="削除"
                          type="submit"
                          width="40px"
                          textSize="sm"
                          onClick={() => deleteRecord(record.id)}
                          useDefaultClass={false}
                          classProps="text-rose-600 text-md align-middle mr-8 hover:scale-110 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default recordList;
