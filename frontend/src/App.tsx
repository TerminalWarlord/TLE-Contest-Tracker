import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';


const queryClient = new QueryClient();

const routes = createBrowserRouter([
  { path: '/', element: <Home /> }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={routes}></RouterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
