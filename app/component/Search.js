

export default function SearchComponent ({queryInput}) {

  return (
    <div>
        <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="m-2">
            <input
              type="text"
              onChange={(e)=>queryInput(e.target.value)}
              className="block p-3 ps-10 text-sm text-gray-900 border border-sky-500 rounded-lg w-50 sm:w-80 bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-cyan-950 dark:border-sky-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
              placeholder="Search for items"
            />
          </div>
    </div>
  );
};