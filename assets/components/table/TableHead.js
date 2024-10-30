import { useState } from "react";

const TableHead = ({ columns, handleSorting, defaultSorting }) => {
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
        {columns.map(({ label, accessor, formatImage }) => {
          let arrow = "";
          if (
            (sortField === accessor && order === "asc") ||
            (sortField === "" &&
              defaultSorting.accessor === accessor &&
              defaultSorting.direction === "asc")
          ) {
            arrow = (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                />
              </svg>
            );
          }

          if (
            (sortField === accessor && order === "desc") ||
            (sortField === "" &&
              defaultSorting.accessor === accessor &&
              defaultSorting.direction === "desc")
          ) {
            arrow = (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </svg>
            );
          }

          const clickable = formatImage
            ? null
            : () => handleSortingChange(accessor);
          const clickable_classname = formatImage
            ? "flex"
            : "flex cursor-pointer";

          return (
            <th
              scope="col"
              className="px-6 py-3"
              key={accessor}
              onClick={clickable}
            >
              <div className={clickable_classname}>
                {label}
                {arrow}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
