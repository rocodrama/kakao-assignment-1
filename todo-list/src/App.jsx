import { useState } from 'react'
import Header from './components/layout/Header'
import WeekView from './components/todo/WeekView'
import Todo from './components/todo/Todo'

function App() {
  const [displayDate, setDisplayDate] = useState(new Date());

  return (
    <div className="box-border flex flex-col min-h-screen w-full bg-surface-bg justify-center items-center">
      <Header />
      <WeekView displayDate={displayDate} setDisplayDate={setDisplayDate} />
      <Todo displayDate={displayDate} setDisplayDate={setDisplayDate} />
    </div>
  )
}

export default App
