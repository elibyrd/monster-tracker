import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Monster from './Monster.js';
import React from 'react';
import Row from 'react-bootstrap/Row';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monsters: [
        // Test data for development.
        { name: 'Skeleton', maxHealth: 13, currentHealth: 13, nameDelta: 0 },
        { name: 'Skeleton', maxHealth: 13, currentHealth: 11, nameDelta: 1 },
        { name: 'Zomble', maxHealth: 22, currentHealth: 10, nameDelta: 0 },
        { name: 'Dragon', maxHealth: 256, currentHealth: 256, nameDelta: 0, legendaryActions: 3, legendaryResistances: 2 },
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

  // Returns the first available delta for the provided monster name.
  // The delta system allows us to track multiple monsters of the same type, and "refill" from the lowest available number when adding a new monster of that type.
  getNameDelta(name){
    let matchingMonsters = this.state.monsters.filter(monster => monster.name.toLowerCase() === name.toLowerCase());
    // If there are no other monsters with this name, we can return 0 right away.
    if(matchingMonsters.length === 0) return 0;

    // Find the first "empty" name delta.
    let usedMonsterDeltas = matchingMonsters.map(monster => monster.nameDelta);
    let deltaCounter = 0;
    // Keep incrementing deltaCounter until we can't find it in usedMonsterDeltas.
    let checkDelta = function(delta){return delta === deltaCounter};
    while(usedMonsterDeltas.find(checkDelta) !== undefined) deltaCounter++;
    return deltaCounter;
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
    event.preventDefault();

    const trimmedMonsterName = this.state.newMonsterName.trim();
    const nameDelta = this.getNameDelta(trimmedMonsterName);
    const newMonsterHealth = parseInt(this.state.newMonsterMaxHP);
    const newMonsterLegendaryActions = parseInt(this.state.newMonsterLegendaryActions);
    const newMonsterLegendaryResistances = parseInt(this.state.newMonsterLegendaryResistances);

    // Check for invalid data before proceeding.
    if(trimmedMonsterName.length <= 0 || Number.isNaN(newMonsterHealth) || Number.isNaN(newMonsterLegendaryActions) || Number.isNaN(newMonsterLegendaryResistances)){
      alert("The provided monster data was invalid. Please review the New Monster form and try again.")
      return;
    }

    // Add new monster to state.
    this.setState({ monsters: [...this.state.monsters, {
      name: trimmedMonsterName,
      nameDelta: nameDelta,
      maxHealth: newMonsterHealth,
      currentHealth: newMonsterHealth,
      legendaryActions: newMonsterLegendaryActions,
      legendaryResistances: newMonsterLegendaryResistances
    }]});
  }

  // Removes the specified monster from the queue.
  handleRemoveMonster(monsterName, monsterNameDelta) {
    this.setState({
      monsters: this.state.monsters.filter(monster => (monster.name.toLowerCase() !== monsterName.toLowerCase() || monster.nameDelta !== monsterNameDelta))
    });
  }

  render() {
    const monsterList = this.state.monsters.map(monster => {
      return (
        <Monster
          key={monster.name+'-'+monster.nameDelta}
          name={monster.name}
          nameDelta={monster.nameDelta ?? 0}
          maxHealth={monster.maxHealth}
          currentHealth={monster.currentHealth}
          legendaryActions={monster.legendaryActions ?? 0}
          legendaryResistances={monster.legendaryResistances ?? 0}
          removeMe={this.handleRemoveMonster}
        />
      )
    });

    return (
      <Container className="d-flex flex-column h-100">
        <h2 className="mt-2">Active Monsters</h2>
        <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
            {monsterList}
        </Row>
        <Form
          className="mt-auto"
          onSubmit={this.addMonster}
        >
          <Row><Col><h2 className="mt-3">New Monster</h2></Col></Row>
          <Row className="mb-3 align-items-center">
            <Col>
              <Form.Group controlId="newMonsterName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="newMonsterName"
                  value={this.state.newMonsterName}
                  onChange={this.handleAddMonsterFormChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="newMonsterMaxHP">
                <Form.Label>Max HP</Form.Label>
                <Form.Control
                  type="number"
                  name="newMonsterMaxHP"
                  value={this.state.newMonsterMaxHP}
                  onChange={this.handleAddMonsterFormChange}
                  className='w-auto'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="newMonsterLegendaryActions">
                <Form.Label>Legendary Actions</Form.Label>
                <Form.Control
                  type="number"
                  name="newMonsterLegendaryActions"
                  value={this.state.newMonsterLegendaryActions}
                  onChange={this.handleAddMonsterFormChange}
                  className='w-auto'
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="newMonsterLegendaryResistances">
                <Form.Label>Legendary Resistances</Form.Label>
                <Form.Control
                  type="number"
                  name="newMonsterLegendaryResistances"
                  value={this.state.newMonsterLegendaryResistances}
                  onChange={this.handleAddMonsterFormChange}
                  className='w-auto'
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={this.addMonster}>
                Add Monster
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }

}

export default App;
