const SortButton = ({ column, sortItems, setSortItems }) => {
  const sortButtonStyle =
    "inline-block ml-3 border-2 border-black rounded-full cursor-pointer hover:scale-110";

  let target = sortItems?.find((item) => item.name === column);

  let sortText = "・";
  if (target?.sort === "desc") sortText = "↓";
  if (target?.sort === "asc") sortText = "↑";

  const handleSort = (target) => {
    if (target.name !== column) return;

    let changedSort;

    if (target.sort === "desc") changedSort = "asc";
    else if (target.sort === "asc") changedSort = null;
    else if (target.sort === null) changedSort = "desc";

    const newParams = sortItems.filter((item) => item.name !== column);

    setSortItems([...newParams, { name: target.name, sort: changedSort }]);
  };

  return (
    <span className={`${sortButtonStyle}`} onClick={() => handleSort(target)}>
      {sortText}
    </span>
  );
};

export default SortButton;
