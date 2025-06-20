import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterPath } from './path';
import LandingPage from '@/pages/Landing';
import MenuPage from '@/pages/Menu';
import FaceGazeSetupPage from '@/pages/FaceGazeSetup';
// import AccuracyPage from '@/pages/Accuracy';

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
    element: <FaceGazeSetupPage />,
  },
  // {
  //   path: RouterPath.AccuracyPage,
  //   element: <AccuracyPage />,
  // },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
