import { useState } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const Table = (props) => {
  const [tableData, setTableData] = useState(props.tableData);

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
    console.log(sortField, sortOrder);
  };

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHead
          columns={props.columns}
          handleSorting={handleSorting}
          defaultSorting={props.defaultSorting}
        />
        <TableBody columns={props.columns} tableData={tableData} />
      </table>
    </>
  );
};

export default Table;
