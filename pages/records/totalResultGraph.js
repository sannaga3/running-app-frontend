import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

const totalResultGraph = ({ records, selectedColumn }) => {
  const recordCount = records.length;
  const graphWidth = recordCount > 15 ? 1200 : 900;
  const barSize = recordCount > 15 ? 20 : 30;

  const convertedRecords = records.map((record) => {
    const date = dayjs(record.date).format("MM/DD");
    let newRecord = { ...record };
    newRecord.date = date;
    return newRecord;
  });

  const convertSelectedColumnToUnit = (selectedColumn) => {
    if (selectedColumn === "distance") return " km";
    if (selectedColumn === "step") return " 歩";
    if (selectedColumn === "cal") return " cal";
  };
  const convertSelectedColumnToJapanese = (selectedColumn, isLabel = false) => {
    if (selectedColumn === "distance") {
      if (isLabel) return "距離/km";
      return "距離";
    }
    if (selectedColumn === "step") return "歩数";
  };

  return (
    <BarChart
      width={graphWidth}
      height={450}
      data={convertedRecords}
      margin={{
        top: 40,
        right: 40,
        left: 50,
        bottom: 60,
      }}
      unit={convertSelectedColumnToUnit(selectedColumn)}
    >
      <XAxis
        dataKey="date"
        interval={0}
        angle={-30}
        dy={5}
        label={{
          value: "日付",
          offset: -40,
          position: "insideBottom",
          fill: "#525252",
          fontSize: "120%",
        }}
      />
      <YAxis
        tickCount={8}
        label={{
          value: convertSelectedColumnToJapanese(selectedColumn, true),
          offset: -50,
          position: "insideLeft",
          fill: "#525252",
          fontSize: "120%",
        }}
      />
      <Tooltip wrapperStyle={{ width: 150, backgroundColor: "#ff0092" }} />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar
        name={convertSelectedColumnToJapanese(selectedColumn)}
        type="monotone"
        dataKey={selectedColumn}
        fill="#ff0092"
        strokeWidth={1}
        unit={convertSelectedColumnToUnit(selectedColumn)}
        barSize={barSize}
      >
        <LabelList
          position="top"
          fill="#ff0092"
          stroke="none"
          dataKey={selectedColumn}
        />
      </Bar>
    </BarChart>
  );
};

export default totalResultGraph;
