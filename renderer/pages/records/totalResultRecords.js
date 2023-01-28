const TotalResultRecords = ({ columns, records, selectedColumn, limit }) => {
  const handleValue = (item) => {
    const key = item[0];

    if (key === "time" || key === "per_time") return item[1].slice(0, -4);
    else if (key === "distance") return `${item[1]} km`;
    return item[1];
  };

  const tableRowStyle =
    "h-10 flex items-center justify-between border-b-2 border-gray-700";

  const cellWidth = (column) => {
    if (column === "id") return "w-20";
    if (column === "date") return "w-28";
    if (column === "distance") return "w-28";
    if (column === "time") return "w-28";
    if (column === "per_time") return "w-28";
    if (column === "step") return "w-20";
    if (column === "cal") return "w-20";
  };

  return (
    <div className="flexCol border-2 border-gray-700 rounded-lg mb-3">
      <div
        className={`${tableRowStyle} space-x-3 font-bold border-b-2 border-gray-700`}
      >
        <div className="w-20 pl-3">ID</div>
        <div className="w-28 pl-3">日付</div>
        {columns.map((column) => (
          <div
            key={column.value}
            className={`${cellWidth(column.value)} ${
              column.value === selectedColumn ? "text-pink-600 pl-3" : "pl-3"
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div className="flexCol">
        {records.map((record, index) => {
          const recordArr = Object.entries(record);
          return (
            <div key={record.id} className={`${tableRowStyle}`}>
              {recordArr.map((item) => (
                <div
                  key={item[0]}
                  className={`${
                    selectedColumn === item[0]
                      ? `${cellWidth(item[0])} text-pink-600 text-left pl-3`
                      : `${cellWidth(item[0])} text-left pl-3`
                  }`}
                >
                  {handleValue(item)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalResultRecords;
