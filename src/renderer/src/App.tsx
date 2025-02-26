import { HashRouter, Route, Routes } from 'react-router-dom';
import { Toolbar } from './components';
import { Home, AddMovie } from './routes';

function App(): JSX.Element {
  return (
    <>
      <Toolbar />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMovie />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
