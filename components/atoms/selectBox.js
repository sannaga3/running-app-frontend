const selectBox = ({
  header,
  importColumns,
  selectedColumns,
  handleSelect,
}) => {
  const handleDisabled = (column) => {
    const targetIndex = selectedColumns.filter(
      (item) => Object.keys(item)[0] === column
    );

    if (targetIndex.length > 0) return "disabled";
    return false;
  };

  return (
    <div className="grid grid-cols-12 gap-1 content-center mb-3">
      {header.map((text) => {
        return (
          <div className="col-span-2 border-2 border-gray-600" key={text}>
            <div className="border-b-2 border-gray-600">{text}</div>
            <select
              onChange={(e) => handleSelect(e.target.value, text)}
              className="w-full"
            >
              {importColumns.map((column) => {
                return (
                  <option
                    value={column}
                    key={column}
                    className="focus:outline-none"
                    disabled={handleDisabled(column)}
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
