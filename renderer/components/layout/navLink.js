import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userState } from "../../states/auth";
import {
  myRecordListState,
  failureRowListState,
  recordSortState,
  recordSearchState,
  recordTotalFormState,
  totalRecordListState,
  totalResultState,
  sortDefaultState,
  searchDefaultState,
  defaultTotalFormState,
} from "../../states/record";

const NavLink = ({
  tabName,
  active,
  href = "#",
  setActiveTab,
  isLogout = false,
  isShowHamburger = false,
}) => {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  const setMyRecordListStat = useSetRecoilState(myRecordListState);
  const setFailureRowList = useSetRecoilState(failureRowListState);
  const setRecordSort = useSetRecoilState(recordSortState);
  const setRecordSearchState = useSetRecoilState(recordSearchState);
  const setRecordTotalForm = useSetRecoilState(recordTotalFormState);
  const setTotalRecordList = useSetRecoilState(totalRecordListState);
  const setTotalResult = useSetRecoilState(totalResultState);

  const commonStyle =
    "text-xl border-b-4 cursor-pointer hover:scale-105 py-0.5 px-2";
  const normalStyle = `${commonStyle} border-gray-600`;
  const activeStyle = `${commonStyle} border-gray-900 font-bold`;
  const style = tabName === active ? activeStyle : normalStyle;

  const textColor = isShowHamburger
    ? "text-white"
    : tabName === active
    ? "text-gray-900"
    : "text-gray-600";

  const handleClick = (e) => {
    e.preventDefault();

    if (isLogout) {
      if (window.confirm("ログアウトしますか？")) {
        setUser({
          id: null,
          username: null,
          email: null,
        });
        setMyRecordListStat([]);
        setFailureRowList([]);
        setRecordSort(sortDefaultState);
        setRecordSearchState(searchDefaultState);
        setRecordTotalForm(defaultTotalFormState);
        setTotalRecordList([]);
        setTotalResult([]);

        return router.push({
          pathname: `/login`,
          query: {
            type: "success",
            message: "ログアウトしました",
          },
        });
      } else {
        return;
      }
    }
    setActiveTab(tabName);
    return router.push(href);
  };

  return (
    <a
      href={href}
      value={tabName}
      onClick={(e) => handleClick(e)}
      className={`${style}`}
    >
      <label htmlFor="navLink" className={`${textColor}`}>
        {tabName}
      </label>
      <input type="radio" name="navLink" className="hidden" value={tabName} />
    </a>
  );
};

export default NavLink;
