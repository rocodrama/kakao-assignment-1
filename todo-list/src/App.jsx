import { useState } from 'react'
import Header from './components/Header'
import Todo from './components/Todo'
import WeekView from './components/WeekView'

function App() {
  const [displayDate, setDisplayDate] = useState(new Date());

  return (
    <div className="box-border flex flex-col min-h-screen w-full bg-[#CEDEF2] flex justify-center items-center">
      <Header />
      <WeekView displayDate={displayDate} setDisplayDate={setDisplayDate} />
      <Todo displayDate={displayDate} setDisplayDate={setDisplayDate} />
    </div>
  )
}

export default App
