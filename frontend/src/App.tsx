import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import Home from './pages/Home';
import Authentication from './pages/Authentication';
import Bookmark from './pages/Bookmarks';
import { authLoader } from './lib/http/actions';
import { UserContext } from './store/user-context';
import { useState } from 'react';


const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: '/', children: [
      { index: true, element: <Home /> },
      { path: "page/:page", element: <Home /> },
      {
        path: 'bookmarks',
        loader: authLoader,
        children: [
          { index: true, element: <Bookmark /> },
          { path: "page/:page", element: <Bookmark /> },
        ]
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const logOut = () => {
    queryClient.removeQueries();
    setIsAuthenticated(false);
    setUser(null);
  }
  const logIn = (role: string) => {
    queryClient.removeQueries();
    setIsAuthenticated(true);
    setUser(role);
  }

  const ctxValue = {
    isAuthenticated,
    user,
    logIn,
    logOut
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <UserContext.Provider value={ctxValue}>
          <RouterProvider router={routes}></RouterProvider>
        </UserContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
