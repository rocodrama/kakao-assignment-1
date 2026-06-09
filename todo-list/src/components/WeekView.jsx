import { useState } from 'react';

export default function WeekView({displayDate, setDisplayDate}) {
    

    const handlePrevClick = () => {
        const prevDate = new Date(displayDate);
        prevDate.setDate(displayDate.getDate() - 1);
        setDisplayDate(prevDate);
    }

    const handleNextClick = () => {
        const nextDate = new Date(displayDate);
        nextDate.setDate(displayDate.getDate() + 1);
        setDisplayDate(nextDate);
    }

    return (
        <div className="flex flex-row justify-center items-center gap-4 mb-7">
            <button className="bg-[#fff] text-[#000] px-4 py-2 rounded hover:bg-[#3A5A8C]"
            onClick={handlePrevClick}>이전</button>
            <span>{displayDate.toLocaleDateString()}</span>
            <button className="bg-[#fff] text-[#000] px-4 py-2 rounded hover:bg-[#3A5A8C]"
            onClick={handleNextClick}>다음</button>
        </div>
    )
}