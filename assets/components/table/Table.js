import { useState } from "react";
import tableData1 from "./tableData1.json";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const Table = (props) => {
  const [tableData, setTableData] = useState(tableData1);

  /*   const columns2 = [
    { label: "Full Name", accessor: "full_name" },
    { label: "Email", accessor: "email" },
    { label: "Gender", accessor: "gender" },
    { label: "Age", accessor: "age" },
    { label: "Start date", accessor: "start_date" },
  ]; */

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHead columns={props.columns} />
        <TableBody columns={props.columns} tableData={tableData} />
      </table>
    </>
  );
};

export default Table;
