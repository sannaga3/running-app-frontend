const selectBox = ({
  header,
  importColumns,
  selectedColumns,
  handleSelect,
  selectedValue = null,
  wrapperStyleProp = null,
  labelStyleProp = null,
  selectStyleProp = null,
  optionStyleProp = null,
}) => {
  const wrapperStyle =
    wrapperStyleProp ?? "grid grid-cols-12 gap-1 content-center mb-3";
  const labelStyle = labelStyleProp ?? "border-b-2 border-gray-600";
  const selectStyle = selectStyleProp ?? "w-full";
  const optionStyle = optionStyleProp ?? "focus:outline-none";

  const handleDisabled = (column) => {
    const targetIndex = selectedColumns.filter(
      (item) => Object.keys(item)[0] === column
    );

    if (targetIndex.length > 0) return "disabled";
    return false;
  };

  return (
    <div className={wrapperStyle}>
      {header.map((text) => {
        return (
          <div
            className={
              !wrapperStyleProp ? "col-span-2 border-2 border-gray-600" : ""
            }
            key={text}
          >
            <div className={labelStyle}>{text}</div>
            <select
              onChange={(e) => handleSelect(e.target.value, text)}
              className={selectStyle}
              defaultValue={selectedValue}
            >
              {importColumns.map((column) => {
                return (
                  <option
                    value={column}
                    key={column}
                    className={optionStyle}
                    disabled={selectedColumns && handleDisabled(column)}
                  >
                    {column}
                  </option>
                );
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default selectBox;
