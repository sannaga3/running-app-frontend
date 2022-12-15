import Link from "next/link";

const navLink = ({ tabName, active, to, setActiveTab }) => {
  const commonStyle =
    "text-xl border-b-4 cursor-pointer hover:scale-110 mt-1 px-2";
  const normalStyle = `${commonStyle} text-orange-600 hover:text-orange border-orange-600`;
  const activeStyle = `${commonStyle} text-red-600 border-red-600`;
  const style = tabName === active ? activeStyle : normalStyle;

  const handleSetActiveTab = (tabName) => {
    return setActiveTab(tabName);
  };

  return (
    <Link href={to} value={tabName} onClick={() => handleSetActiveTab(tabName)}>
      <label htmlFor="navLink" className={style}>
        {tabName}
      </label>
      <input type="radio" name="navLink" className="hidden" value="Top" />
    </Link>
  );
};

export default navLink;
