const TableBody = ({ tableData, columns, changeCurrent }) => {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id} className="even:bg-gray-50 odd:bg-white border-b">
            {columns.map(
              ({
                accessor,
                formatImage,
                formatNumber,
                classNames,
                link,
                link_accessor,
              }) => {
                const tData = data[accessor] ? data[accessor] : "——";

                let tData2 = formatImage ? (
                  <img src={tData} className="w-24 border border-black m-4" />
                ) : (
                  tData
                );

                tData2 = formatNumber
                  ? Intl.NumberFormat().format(tData2)
                  : tData2;

                function click() {
                  // it will not print the value
                  changeCurrent("Country", data[link_accessor]);
                }

                return (
                  <td
                    key={accessor}
                    className={classNames}
                    onClick={link ? click : undefined}
                  >
                    {tData2}
                  </td>
                );
              }
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
