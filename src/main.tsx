import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Remove or comment out the React Router configuration that was causing the error
// The code below was causing the error because 'routes' is not defined
/*
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  routes,
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);
*/
