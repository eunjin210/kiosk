import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterPath } from './path';
import LandingPage from '@/pages/Landing';
import MenuPage from '@/pages/Menu';
import CalibrationPage from '@/pages/Webgazer';
const router = createBrowserRouter([
  {
    path: RouterPath.Landing,
    element: <LandingPage />,
  },
  {
    path: RouterPath.MenuPage,
    element: <MenuPage />,
  },
  {
    path: RouterPath.Calibration,
    element: <CalibrationPage />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
