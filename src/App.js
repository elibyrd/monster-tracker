import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import configData from "./config.json";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Markdown from 'react-markdown';
import Monster from './Monster.js';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import remarkGfm from 'remark-gfm';
import Row from 'react-bootstrap/Row';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monsters: [
        // Test data for development.
        { name: 'Skeleton', maxHealth: 13, currentHealth: 13, AC: 13, nameDelta: 0 },
        { name: 'Skeleton', maxHealth: 13, currentHealth: 11, nameDelta: 1 },
        { name: 'Zomble', maxHealth: 22, currentHealth: 10, AC: 8, nameDelta: 0 },
        { name: 'Dragon', maxHealth: 256, currentHealth: 256, nameDelta: 0, maxLegendaryActions: 3, currentLegendaryActions: 2, maxLegendaryResistances: 2, currentLegendaryResistances: 2 },
      ],
      monsterHistory: [],
      newMonsterName: '',
      newMonsterMaxHP: 0,
      newMonsterAC: 0,
      newMonsterLegendaryActions: 0,
      newMonsterLegendaryResistances: 0,
      newMonsterStatblock: '',
      historySidebarOpen: false,
      statblockSidebarOpen: false,
      currentStatblock: '',
      currentStatblockName: '',
      preloadedMonsters: '',
      newMonsterSelect: '',
    };

    this.monsterEndpoint = false;

    this.addMonster = this.addMonster.bind(this);
    this.changeMonsterHealth = this.changeMonsterHealth.bind(this);
    this.changeMonsterLegendaryResources = this.changeMonsterLegendaryResources.bind(this);
    this.handleAddMonsterFormChange = this.handleAddMonsterFormChange.bind(this);
    this.handleMonsterSelect = this.handleMonsterSelect.bind(this);
    this.handleMonsterInfo = this.handleMonsterInfo.bind(this);
    this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
    this.renderMonsterElement = this.renderMonsterElement.bind(this);
    this.renderMonsterList = this.renderMonsterList.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.undoMonsterChange = this.undoMonsterChange.bind(this);
  }

  componentDidMount() {
    // If we loaded config data, assign to local variables.
    if(configData) {
      this.monsterEndpoint = configData.PRESETS_ENDPOINT;
    }

    this.loadMonstersFromEndpoint();
  }

  // If a preloads endpoint was supplied in config, load in the monster data.
  loadMonstersFromEndpoint(){
    if(!this.monsterEndpoint) return;
    fetch(this.monsterEndpoint)
      .then((res) => res.json())
      .then((json) => {
        if(json.data){
          this.setState({
            preloadedMonsters: json.data,
          });
        }
      });
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

  // Special handler for the "presets" select element.
  handleMonsterSelect(event){
    // Handle the standard form state change.
    this.handleAddMonsterFormChange(event);
    const target = event.target;
    const value = target.value;

    // Look for the selected monster in our preloads.
    let checkPreloadedMonsters = function(monster){return String(monster.id) === value};
    let monsterIndex = this.state.preloadedMonsters.findIndex(checkPreloadedMonsters);
    // If present, replace the form data with the selected monster's data.
    if(monsterIndex >= 0){
      let monster = this.state.preloadedMonsters[monsterIndex];
      this.setState({
        newMonsterName: monster.name,
        newMonsterMaxHP: parseInt(monster.maxHP),
        newMonsterAC: monster.AC ? parseInt(monster.AC) : 0,
        newMonsterLegendaryActions: monster.legendaryActions ? parseInt(monster.legendaryActions) : 0,
        newMonsterLegendaryResistances: monster.legendaryResistance ? parseInt(monster.legendaryResistances) : 0,
        newMonsterStatblock: monster.statblock ?? '',
      });
    }
    // If we couldn't find a matching monster, the default option was probably selected.
    // Clear the contents of the New Monster form.
    else {
      this.setState({
        newMonsterName: '',
        newMonsterMaxHP: 0,
        newMonsterAC: 0,
        newMonsterLegendaryActions: 0,
        newMonsterLegendaryResistances: 0,
        newMonsterStatblock: '',
      });
    }
  }

  // Updates visibility of specified sidebar element.
  toggleSidebar(sidebarKey) {
    switch(sidebarKey){
      case "history":
        this.setState({historySidebarOpen: !this.state.historySidebarOpen});
        break;
      case "statblock":
        this.setState({statblockSidebarOpen: !this.state.statblockSidebarOpen});
        break;
      default:
    }
  }

  // Adds a new monster to the state using values stored from "New Monster" form.
  addMonster(event) {
    event.preventDefault();

    const trimmedMonsterName = this.state.newMonsterName.trim();
    const nameDelta = this.getNameDelta(trimmedMonsterName);
    const newMonsterHealth = parseInt(this.state.newMonsterMaxHP);
    const newMonsterAC = parseInt(this.state.newMonsterAC);
    const newMonsterLegendaryActions = parseInt(this.state.newMonsterLegendaryActions);
    const newMonsterLegendaryResistances = parseInt(this.state.newMonsterLegendaryResistances);

    // Check for invalid data before proceeding.
    if(
      trimmedMonsterName.length <= 0
      || Number.isNaN(newMonsterHealth)
      || Number.isNaN(newMonsterLegendaryActions)
      || Number.isNaN(newMonsterLegendaryResistances)
      || parseInt(newMonsterHealth) < 0
      || parseInt(newMonsterAC) < 0
      || parseInt(newMonsterLegendaryActions) < 0
      || parseInt(newMonsterLegendaryResistances) < 0
    ){
      alert("The provided monster data was invalid. Please review the New Monster form and try again.")
      return;
    }

    // Push current monster array to state history
    this.updateMonsterHistory("Created new " + trimmedMonsterName + " with " + newMonsterHealth + " health.");
    // Add new monster to state.
    this.setState({ monsters: [...this.state.monsters, {
      name: trimmedMonsterName,
      nameDelta: nameDelta,
      maxHealth: newMonsterHealth,
      currentHealth: newMonsterHealth,
      AC: newMonsterAC,
      maxLegendaryActions: newMonsterLegendaryActions,
      currentLegendaryActions: newMonsterLegendaryActions,
      maxLegendaryResistances: newMonsterLegendaryResistances,
      currentLegendaryResistances: newMonsterLegendaryResistances,
      statblock: this.state.newMonsterStatblock
    }]});
  }

  // Alters monster's health by the value stored from the HP update box.
  changeMonsterHealth(monsterKey, hpDelta) {
    let hpDeltaInt = parseInt(hpDelta);

    // Check for invalid data before proceeding.
    if(Number.isNaN(hpDeltaInt)) return;

    // Update monster health
    const newMonsters = this.state.monsters.slice();
    const monsterIndex = this.findMonsterIndexByKey(monsterKey);
    const monsterToModify = newMonsters[monsterIndex];
    const oldHealth = monsterToModify.currentHealth;
    let newHealth;
    if(hpDelta.indexOf('+') === 0 || hpDelta.indexOf('-') === 0){
      newHealth = monsterToModify.currentHealth + hpDeltaInt;
    }
    else {
      newHealth = hpDeltaInt;
    }
    // Push current monster array to state history
    this.updateMonsterHistory("Changed health of " + this.getMonsterDisplayName(monsterToModify) + " from " + oldHealth + " to " + newHealth + ".");
    monsterToModify.currentHealth = newHealth;
    // Push updates to state.
    this.setState({monsters: newMonsters});
  }
  
  // Processes ticks and resets to legendary actions and resistances.
  changeMonsterLegendaryResources(monsterKey, action) {
    const newMonsters = this.state.monsters.slice();
    const monsterIndex = this.findMonsterIndexByKey(monsterKey);
    const monsterToModify = newMonsters[monsterIndex];
    const monsterName = this.getMonsterDisplayName(monsterToModify);

    // Push current monster array to state history and update specified resource.
    switch(action){
      case "legendaryActionTick":
        this.updateMonsterHistory("Reduced "+monsterName+" legendary actions from "+monsterToModify.currentLegendaryActions+" to "+(monsterToModify.currentLegendaryActions-1)+".");
        monsterToModify.currentLegendaryActions -= 1;
        break;
      case "legendaryActionReset":
        this.updateMonsterHistory("Restored "+monsterName+" legendary actions from "+monsterToModify.currentLegendaryActions+" to "+(monsterToModify.maxLegendaryActions)+".");
        monsterToModify.currentLegendaryActions = monsterToModify.maxLegendaryActions;
        break;
      case "legendaryResistanceTick":
        this.updateMonsterHistory("Reduced "+monsterName+" legendary resistances from "+monsterToModify.currentLegendaryResistances+" to "+(monsterToModify.currentLegendaryResistances-1)+".");
        monsterToModify.currentLegendaryResistances -= 1;
        break;
      case "legendaryResistanceReset":
        this.updateMonsterHistory("Restored "+monsterName+" legendary resistances from "+monsterToModify.currentLegendaryResistances+" to "+(monsterToModify.maxLegendaryResistances)+".");
        monsterToModify.currentLegendaryResistances = monsterToModify.maxLegendaryResistances;
        break;
      default:
    }
    // Push updates to state.
    this.setState({monsters: newMonsters});
  }

  // Returns the index of the provided monster key in the current monsters array.
  findMonsterIndexByKey(monsterKey){
    let checkMonsterKey = function(monster){return (monster.name+'-'+monster.nameDelta) === monsterKey};
    return this.state.monsters.findIndex(checkMonsterKey);
  }

  // Returns the display name for the provided monster.
  getMonsterDisplayName(monster){
      // Only add numbers to the's name if there is more than one of its type.
      let matchingMonsters = this.state.monsters.filter(stateMonster => stateMonster.name.toLowerCase() === monster.name.toLowerCase());
      let displayName = monster.name;
      if(matchingMonsters.length > 1) displayName += " " + (monster.nameDelta + 1);
      return displayName;
  }

  // Removes the specified monster from the queue.
  handleRemoveMonster(monsterName, monsterNameDelta) {
    const monsterIndex = this.findMonsterIndexByKey(monsterName+'-'+monsterNameDelta);
    const monsterToRemove = this.state.monsters[monsterIndex];
    const monsterDisplayName = this.getMonsterDisplayName(monsterToRemove);
    // Push current monster array to state history
    this.updateMonsterHistory("Removed " + monsterDisplayName + " with " + monsterToRemove.currentHealth + " health.");
    // Remove monster.
    this.setState({
      monsters: this.state.monsters.filter(monster => (monster.name.toLowerCase() !== monsterName.toLowerCase() || monster.nameDelta !== monsterNameDelta))
    });
  }

  // Opens statblock sidebar with specified monster's name and statblock.
  handleMonsterInfo(monsterKey){
    const monsterIndex = this.findMonsterIndexByKey(monsterKey);
    const monsterToDisplay = this.state.monsters[monsterIndex];
    this.setState({
      currentStatblockName: this.getMonsterDisplayName(monsterToDisplay),
      currentStatblock: monsterToDisplay.statblock,
    });
    this.toggleSidebar('statblock');
  }

  // Returns the monsters state to the last stored snapshot.
  undoMonsterChange() {
    // Do nothing if there is no history to recover
    if(this.state.monsterHistory.length <= 0) return;

    const lastMonsters = this.state.monsterHistory[this.state.monsterHistory.length - 1].monsters;
    this.setState({
      // Set monster state to most recent snapshot
      monsters: lastMonsters,
      // Remove last snapshot from monster history
      monsterHistory: this.state.monsterHistory.slice(0, this.state.monsterHistory.length - 1)
    });
  }

  // Pushes the current monsters array to the monsterHistory array.
  updateMonsterHistory(comment){
    // We can use JSON conversion to deep copy the monsters array because it doesn't hold any incompatible data types.
    const monstersCopy = JSON.parse(JSON.stringify(this.state.monsters));
    this.setState({ monsterHistory: [...this.state.monsterHistory, {
      comment: comment,
      monsters: monstersCopy,
      timestamp: Date.now(),
    }]});
  }

  // Callback for rendering individual monsters.
  renderMonsterElement(monster){
      let key = monster.name+'-'+monster.nameDelta;

      return (
        <Col md="auto" key={monster.name+'-'+monster.nameDelta}>
          <Monster
            key={key}
            myKey={key}
            name={monster.name}
            displayName={this.getMonsterDisplayName(monster)}
            nameDelta={monster.nameDelta ?? 0}
            maxHealth={monster.maxHealth}
            currentHealth={monster.currentHealth}
            AC={monster.AC}
            maxLegendaryActions={monster.maxLegendaryActions ?? 0}
            currentLegendaryActions={monster.currentLegendaryActions ?? 0}
            maxLegendaryResistances={monster.maxLegendaryResistances ?? 0}
            currentLegendaryResistances={monster.currentLegendaryResistances ?? 0}
            statblock={monster.statblock ?? ''}
            changeMyHealth={this.changeMonsterHealth}
            changeMyLegendaryResources={this.changeMonsterLegendaryResources}
            handleInfo={this.handleMonsterInfo}
            removeMe={this.handleRemoveMonster}
          />
        </Col>
      );
  }

  // Generates JSX for all monsters, splitting out legendary monsters as necessary.
  renderMonsterList(){
    // Split monsters into legendary and normal monsters.
    let legendaryMonsters = [];
    let normalMonsters = [];
    this.state.monsters.forEach((monster) => (monster.maxLegendaryActions || monster.maxLegendaryResistances ? legendaryMonsters : normalMonsters).push(monster));
    const monsterList = normalMonsters.sort(this.sortMonster).map(this.renderMonsterElement);
    const legendaryMonsterList = legendaryMonsters.length ? legendaryMonsters.sort(this.sortMonster).map(this.renderMonsterElement) : false;

    // If there are legendary monsters, render them in a separate column.
    if(legendaryMonsterList){
      return (
        <Row className="g-2">
            <Col className="g-2" md="auto">
              <Row className="legendaryRow g-2">
                {legendaryMonsterList}
              </Row>
            </Col>
            <Col>
              <Row className="g-2">
                {monsterList}
              </Row>
            </Col>
        </Row>
      );
    }

    return (
      <Row className="g-2">
          {legendaryMonsterList}
          {monsterList}
      </Row>
    );
  }

  // Callback for sorting monsters by name and delta.
  sortMonster(a, b){
    if(a.name === b.name) return a.nameDelta - b.nameDelta;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  }

  render() {
    return (
      <Container className="d-flex flex-column h-100">
        <h2 className="mt-2">Active Monsters</h2>
        {this.renderMonsterList()}
        <Form
          className="mt-auto"
          onSubmit={this.addMonster}
        >
          <Row><Col><h2 className="mt-3">New Monster</h2></Col></Row>
          <Row className="mb-3 align-items-center">
            <Col className="col-auto">
              <Row>
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
                      min={0}
                      onChange={this.handleAddMonsterFormChange}
                      className='w-auto'
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="newMonsterAC">
                    <Form.Label>AC</Form.Label>
                    <Form.Control
                      type="number"
                      name="newMonsterAC"
                      value={this.state.newMonsterAC}
                      min={0}
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
                      min={0}
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
                      min={0}
                      onChange={this.handleAddMonsterFormChange}
                      className='w-auto'
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="newMonsterStatblock">
                    <Form.Label>Statblock</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="newMonsterStatblock"
                      value={this.state.newMonsterStatblock}
                      rows={3}
                      onChange={this.handleAddMonsterFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {this.state.preloadedMonsters.length > 0 &&
              <Row>
                <Col>
                  <Form.Group controlId="newMonsterSelect">
                    <Form.Label>Presets</Form.Label>
                    <Form.Control
                      as="select"
                      name="newMonsterSelect"
                      value={this.state.newMonsterSelect}
                      onChange={this.handleMonsterSelect}
                    >
                      <option value=''>-</option>
                      {this.state.preloadedMonsters.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              }
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
        {this.state.monsterHistory.length > 0 &&
          <div className="d-flex flex-column position-fixed top-0 end-0 mt-3 me-3">
            <Button
              variant="info"
              onClick={this.undoMonsterChange}>
              Undo
            </Button>
            <Button
              variant="light"
              onClick={() => this.toggleSidebar('history')}
              className="mt-1">
              History
            </Button>
          </div>
        }
        {this.state.monsterHistory.length > 0 &&
          <Offcanvas
            show={this.state.historySidebarOpen}
            onHide={() => this.toggleSidebar('history')}
            scroll={true}
            placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ListGroup variant="flush">
                {this.state.monsterHistory.toReversed().slice(0, 50).map((item) => (
                  <ListGroup.Item key={item.timestamp}>
                    <ReactTimeAgo date={item.timestamp} locale="en-US"/>: {item.comment}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Offcanvas.Body>
          </Offcanvas>
        }
        <Offcanvas
          show={this.state.statblockSidebarOpen}
          onHide={() => this.toggleSidebar('statblock')}
          scroll={true}
          placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Statblock for {this.state.currentStatblockName}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='statblock'>
            <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Add bootstrap classes to tables formatted via remarkGfm
              table(props) {
                const {node, ...rest} = props
                return <table className='table table-bordered' {...rest} />
              },
              thead(props) {
                const {node, ...rest} = props
                return <thead className='table-light' {...rest} />
              }
            }}>
              {this.state.currentStatblock}
            </Markdown>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    );
  }

}

export default App;
