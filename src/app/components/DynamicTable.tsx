export default function DynamicTable({inputString, inputFrame, selectedOption}: {inputString: string, inputFrame: number, selectedOption: string}) {
    return(
        <div className="flex flex-col items-center justify-center w-[50%] h-[70vh] bg-white text-black gap-5">
            <h1 className="text-2xl">Dynamic Table</h1>
            <table className="border-collapse border border-gray-300 w-full">
                <thead>
                    <tr>
                        {
                            inputString.split("").map((header, index) => (
                                <th key={index} className="border border-gray-300 p-2 bg-gray-100">
                                    {header}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from({ length: inputFrame }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                {
                                    ["1", "2", "3", "4", "5", "6", "7"].map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border border-gray-300 p-2 text-center">
                                            {cell}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}