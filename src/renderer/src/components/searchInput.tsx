import { Search } from 'lucide-react'; // Importing the search icon

const SearchInput = () => {
  return (
    <div className="relative flex items-center border border-gray-300  w-[390px] h-[40px] max-w-sm rounded-[6px]">
      <input
        type="text"
        placeholder="البحث عن"
        className="w-full h-full py-2 px-4 pr-[10px] text-lg rounded-[6px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-x-blue-300 focus:border-opacity-50  "
      />
      <Search className="absolute left-[10px] top-[9px] text-[#ADB8CC] font-bold pointer-events-none" />
    </div>
  );
};

export default SearchInput;
