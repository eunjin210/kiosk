import './App.css';
import { Routes } from './routes';
import GlobalGazeTracker from './components/Common/GlobalGazerTraker';
function App() {
  return (
    <>
      <GlobalGazeTracker />
      <Routes />
    </>
  );
}

export default App;
