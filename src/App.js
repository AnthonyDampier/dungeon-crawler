import './App.css';
import GenerateDungeon from './Components/Dungeon/GenerateDungeon';

function App() {
  return (
    <div className="App">
      <h1>React App</h1>
      {/* Dungeon Modeling */}
      <GenerateDungeon />
    </div>
  );
}

export default App;
