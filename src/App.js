import './App.css';
import Monster from './Monster.js';

// Test data for development.
const monsters = [
  { name: 'Skeleton', maxHealth: 13, currentHealth: 13 },
  { name: 'Zomble', maxHealth: 22, currentHealth: 10 }
]

function App() {

  const monsterList = monsters.map(monster => {
    return (
      <Monster
        key={monster.name}
        name={monster.name}
        maxHealth={monster.maxHealth}
        currentHealth={monster.currentHealth}
      />
    )
  });

  return (
  <div className="App">
    <div className="monsterContainer">
      {monsterList}
    </div>
  </div>
  );

}

export default App;
