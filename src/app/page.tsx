import DynamicTable from "./components/DynamicTable";

export default function Home() {
  return (
    <main className="flex items-center justify-between p-24">
      <section className="flex flex-col items-center justify-center w-[50%] bg-[#272626] h-[70vh] gap-20">
        {/* Title */}
        <h1 className="text-2xl">REPLACEMENT ALGORITHMS</h1>

        <div className="flex flex-col gap-5">
          {/* Input string */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="input-string">Input:</label>
            <input type="text" id="input-string" className="border-amber-50 border-1 p-1"/>
          </div>
          {/* Input Frame */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="input-frame">Frame:</label>
            <input type="number" id="input-frame" className="border-amber-50 border-1 p-1"/>
          </div>
          {/* Options */}
          <div className="flex items-center justify-between gap-5">
            <label htmlFor="replacement-select">Choose an option:</label>
            <select id="replacement-select" name="replacement" className="cursor-pointer border-amber-50 border-1 p-1">
              <option value="1" className="text-black">Option 1</option>
              <option value="2" className="text-black">Option 2</option>
              <option value="3" className="text-black">Option 3</option>
            </select>
          </div>
        </div>
        {/* Button Run */}
        <button className="bg-[#4f46e5] text-white px-4 py-2 rounded-md mt-5 cursor-pointer hover:bg-[#4338ca] transition duration-200">
            Run
        </button>
      </section>
      {/* Dynamic Table */}
      <section className="flex flex-col items-center justify-center w-[50%] h-[70vh] bg-white text-black">
        <DynamicTable />
      </section>
    </main>
  );
}
