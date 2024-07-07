export default function LoadingTableSkeleon() {

  return (
    <div role="status" className="max-w-sm animate-pulse">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className=" bg-gray-50 dark:bg-sky-500 dark:text-white">
                <tr>
                    <th className="cursor-pointer px-6 py-3 bg-gray-200 rounded-full dark:bg-gray-700"></th>
                </tr>
            </thead>
            <tbody className="overflow-y-auto">
                <tr className="bg-white border-b dark:bg-transparent dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="bg-gray-200 rounded-full dark:bg-gray-700"></td>
                </tr>
            </tbody>
        </table>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
