import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './components/Home';


const routes = createBrowserRouter([
  { path: '/', element: <Home /> }
])

function App() {
  return (
    <RouterProvider router={routes}></RouterProvider>
  )
}

export default App
