import './App.css';
import React from 'react';
import Monster from './Monster.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monsters: [
        // Test data for development.
        { name: 'Skeleton', maxHealth: 13, currentHealth: 13 },
        { name: 'Zomble', maxHealth: 22, currentHealth: 10 }
      ],
      newMonsterName: '',
      newMonsterMaxHP: 0,
    };

    this.handleAddMonsterFormChange = this.handleAddMonsterFormChange.bind(this);
    this.addMonster = this.addMonster.bind(this);
  }

  handleAddMonsterFormChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  addMonster(event) {
    const newMonsterHealth = parseInt(this.state.newMonsterMaxHP);
    this.setState({ monsters: [...this.state.monsters, { name: this.state.newMonsterName, maxHealth: newMonsterHealth, currentHealth: newMonsterHealth }] })

    event.preventDefault();
  }

  render() {
    const monsterList = this.state.monsters.map(monster => {
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
        <fieldset
          className="addMonsterFieldset"
        >
          <legend>New Monster</legend>
          <form
            className="addMonsterForm"
            onSubmit={this.addMonster}
          >
            <label>
              Name:
              <input
                type="text"
                name="newMonsterName"
                value={this.state.newMonsterName}
                onChange={this.handleAddMonsterFormChange}
              />
            </label>
            <label>
              Max HP:
              <input
                type="text"
                name="newMonsterMaxHP"
                value={this.state.newMonsterMaxHP}
                onChange={this.handleAddMonsterFormChange}
              />
            </label>
            <button
              onClick={this.addMonster}>
              Add Monster
            </button>
          </form>
        </fieldset>
        <div className="monsterContainer">
          {monsterList}
        </div>
      </div>
    );
  }

}

export default App;
