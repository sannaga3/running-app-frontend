import { Table } from "reactstrap";

const totalResultRecords = ({ columns, records, selectedColumn }) => {
  const handleValue = (item) => {
    const key = item[0];

    if (key === "time" || key === "per_time") return item[1].slice(0, -4);
    else if (key === "distance") return `${item[1]} km`;
    return item[1];
  };

  return (
    <div className="border-4 border-gray-400 rounded-xl mb-3">
      <Table>
        <thead className="border-b-4 border-gray-400 rounded-xl">
          <tr>
            <th className="w-[100px]">ID</th>
            <th className="w-[150px]">日付</th>
            {columns.map((column) => (
              <th
                key={column.value}
                className={`w-[120px] ${
                  column.value === selectedColumn ? "text-orange-500" : ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const recordArr = Object.entries(record);
            return (
              <tr key={record.id}>
                {recordArr.map((item) => (
                  <td
                    key={item[0]}
                    className={`${
                      selectedColumn === item[0] ? "text-orange-500" : ""
                    }`}
                  >
                    {handleValue(item)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default totalResultRecords;
