import { useState } from "react";

const TableHead = ({ columns, handleSorting }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {columns.map(({ label, accessor }) => {
          return (
            <th
              scope="col"
              className="px-6 py-3"
              key={accessor}
              onClick={() => handleSortingChange(accessor)}
            >
              {label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </svg>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
