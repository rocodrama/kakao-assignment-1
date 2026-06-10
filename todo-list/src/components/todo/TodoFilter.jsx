import {useState} from 'react';

export default function TodoFilter({filter, setFilter}) {
    return (
        <div className="flex flex-row justify-between items-center mb-2 gap-[8px]">
                <button className={`${filter === '전체' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('전체')} >
                    전체
                </button>
                <button className={`${filter === '완료' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('완료')} >
                    완료
                </button>
                <button className={`${filter === '진행중' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('진행중')} >
                    진행중
                </button>
        </div>
    )
}