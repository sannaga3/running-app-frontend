import { useRouter } from "next/router";

const navLink = ({
  tabName,
  active,
  href = "#",
  setActiveTab,
  isLogout = false,
  setUser = null,
}) => {
  const router = useRouter();

  const commonStyle =
    "text-xl border-b-4 cursor-pointer hover:scale-110 mt-1 px-2";
  const normalStyle = `${commonStyle} text-orange-600 hover:text-orange border-orange-600`;
  const activeStyle = `${commonStyle} text-red-600 border-red-600`;
  const style = tabName === active ? activeStyle : normalStyle;

  const handleClick = (e) => {
    e.preventDefault();

    if (isLogout) {
      if (window.confirm("ログアウトしますか？")) {
        setUser({
          id: null,
          username: null,
          email: null,
        });

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
    <a href={href} value={tabName} onClick={(e) => handleClick(e)}>
      <label htmlFor="navLink" className={style}>
        {tabName}
      </label>
      <input type="radio" name="navLink" className="hidden" value={tabName} />
    </a>
  );
};

export default navLink;
