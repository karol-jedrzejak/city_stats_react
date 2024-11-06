import { useState } from "react";

const TableHead = ({ columns, handleSorting, defaultSorting }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === "asc" ? "dsc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {columns.map(({ label, accessor, formatImage, disableSorting }) => {
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
            (sortField === accessor && order === "dsc") ||
            (sortField === "" &&
              defaultSorting.accessor === accessor &&
              defaultSorting.direction === "dsc")
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

          let clickable = formatImage
            ? null
            : () => handleSortingChange(accessor);
          let clickable_classname = formatImage
            ? "flex justify-center items-center"
            : "flex justify-center items-center cursor-pointer";

          if (disableSorting) {
            clickable = null;
            clickable_classname = "flex justify-center items-center";
          }

          return (
            <th
              scope="col"
              className="px-3 py-3 text-center"
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
