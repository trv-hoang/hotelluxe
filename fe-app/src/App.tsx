import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
        Bấm vào 💚
      </Button>
    </div>
  );
}

export default App
