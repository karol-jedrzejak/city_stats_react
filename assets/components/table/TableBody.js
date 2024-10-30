const TableBody = ({ tableData, columns }) => {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id} className="even:bg-gray-50 odd:bg-white border-b">
            {columns.map(
              ({ accessor, formatImage, formatNumber, classNames }) => {
                const tData = data[accessor] ? data[accessor] : "——";

                let tData2 = formatImage ? (
                  <img src={tData} className="w-24 border border-black m-4" />
                ) : (
                  tData
                );

                tData2 = formatNumber
                  ? Intl.NumberFormat().format(tData2)
                  : tData2;

                return (
                  <td key={accessor} className={classNames}>
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
