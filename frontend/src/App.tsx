import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Bookmark from './pages/Bookmarks';
import { authLoader } from './lib/http/actions';


const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: '/', children: [
      { index: true, element: <Home /> },
      {
        path: 'bookmarks',
        element: <Bookmark />,
        loader: authLoader
      },
      {
        path: 'auth', children: [
          { index: true, element: <Authentication /> },
          { path: ':mode', element: <Authentication /> }
        ]
      }
    ]
  },

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
