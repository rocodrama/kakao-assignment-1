import { useState } from 'react'
import Header from './components/Header'
import WeekView from './components/WeekView'
import Todo from './components/Todo'

function App() {

  return (
    <div className="box-border flex flex-col min-h-screen w-full bg-[#CEDEF2] flex justify-center items-center">
      <Header />
      {/* <WeekView /> */}
      <Todo/>
    </div>
  )
}

export default App
