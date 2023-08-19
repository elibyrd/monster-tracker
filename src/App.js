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
        { name: 'Zomble', maxHealth: 22, currentHealth: 10 },
        { name: 'Dragon', maxHealth: 256, currentHealth: 256, legendaryActions: 3, legendaryResistances: 2 },
      ],
      newMonsterName: '',
      newMonsterMaxHP: 0,
      newMonsterLegendaryActions: 0,
      newMonsterLegendaryResistances: 0,
    };

    this.handleAddMonsterFormChange = this.handleAddMonsterFormChange.bind(this);
    this.addMonster = this.addMonster.bind(this);
    this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
  }

  // Stores all changes to "New Monster" form in state.
  handleAddMonsterFormChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  // Adds a new monster to the state using values stored from "New Monster" form.
  addMonster(event) {
    const newMonsterHealth = parseInt(this.state.newMonsterMaxHP);
    const newMonsterLegendaryActions = parseInt(this.state.newMonsterLegendaryActions);
    const newMonsterLegendaryResistances = parseInt(this.state.newMonsterLegendaryResistances);
    this.setState({ monsters: [...this.state.monsters, {
      name: this.state.newMonsterName,
      maxHealth: newMonsterHealth,
      currentHealth: newMonsterHealth,
      legendaryActions: newMonsterLegendaryActions,
      legendaryResistances: newMonsterLegendaryResistances
    }]});

    event.preventDefault();
  }

  // Removes the monster with the provided name from the queue.
  handleRemoveMonster(monsterName) {
    this.setState({
      monsters: this.state.monsters.filter(monster => monster.name !== monsterName)
    });
  }

  render() {
    const monsterList = this.state.monsters.map(monster => {
      return (
        <Monster
          key={monster.name}
          name={monster.name}
          maxHealth={monster.maxHealth}
          currentHealth={monster.currentHealth}
          legendaryActions={monster.legendaryActions ?? 0}
          legendaryResistances={monster.legendaryResistances ?? 0}
          removeMe={this.handleRemoveMonster}
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
            <label>
              Legendary Actions:
              <input
                type="text"
                name="newMonsterLegendaryActions"
                value={this.state.newMonsterLegendaryActions}
                onChange={this.handleAddMonsterFormChange}
              />
            </label>
            <label>
              Legendary Resistances:
              <input
                type="text"
                name="newMonsterLegendaryResistances"
                value={this.state.newMonsterLegendaryResistances}
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
