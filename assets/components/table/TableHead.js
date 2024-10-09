const TableHead = ({ columns }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {columns.map(({ label, accessor }) => {
          return (
            <th scope="col" className="px-6 py-3" key={accessor}>
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
