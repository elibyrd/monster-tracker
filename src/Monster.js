import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';

class Monster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentHealth: props.currentHealth,
      hpDelta: '',
    };

    this.handleDelta = this.handleDelta.bind(this);
    this.handleHealthSubmit = this.handleHealthSubmit.bind(this);
    this.handleLegendaryChange = this.handleLegendaryChange.bind(this);
    this.handleInfo = this.handleInfo.bind(this);
  }

  // Stores the value entered in the HP update box to state.
  handleDelta(event) {
    this.setState({hpDelta: event.target.value});
  }

  // Alters monster's health by the value stored from the HP update box.
  handleHealthSubmit(event) {
    event.preventDefault();

    this.props.changeMyHealth(this.props.myKey, this.state.hpDelta);
  }

  // Processes ticks and resets to legendary actions and resistances.
  handleLegendaryChange(action) {
    this.props.changeMyLegendaryResources(this.props.myKey, action);
  }

  // Handles click on info button.
  handleInfo() {
    this.props.handleInfo(this.props.myKey);
  }

  render() {
    // Only render the legendary action widget if the monster has at least 1 legendary action.
    let legendaryActionWidget;
    if (this.props.maxLegendaryActions){
      legendaryActionWidget = (
        <ListGroup.Item className="bg-transparent">
          <div>Legendary actions</div>
          <div className="fs-3">{this.props.currentLegendaryActions} / {this.props.maxLegendaryActions}</div>
          <ButtonGroup aria-label="Legendary action options" className="mt-1">
            <Button
              variant="light"
              onClick={()=> this.handleLegendaryChange('legendaryActionTick')}>
              Tick
            </Button>
            <Button
              variant="light"
              onClick={()=> this.handleLegendaryChange('legendaryActionReset')}>
              Reset
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      );
    }

    // Only render the legendary resistance widget if the monster has at least 1 legendary resistance.
    let legendaryResistanceWidget;
    if (this.props.maxLegendaryResistances){
      legendaryResistanceWidget = (
        <ListGroup.Item className="bg-transparent">
          <div>Legendary resistances</div>
          <div className="fs-3">{this.props.currentLegendaryResistances} / {this.props.maxLegendaryResistances}</div>
          <ButtonGroup aria-label="Legendary resistance options" className="mt-1">
            <Button
              variant="light"
              onClick={()=> this.handleLegendaryChange('legendaryResistanceTick')}>
              Tick
            </Button>
            <Button
              variant="light"
              onClick={()=> this.handleLegendaryChange('legendaryResistanceReset')}>
              Reset
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      );
    }

    let legendarySection;
    if(legendaryActionWidget || legendaryResistanceWidget){
      legendarySection = (
        <ListGroup className="bg-transparent" variant="flush">
          {legendaryActionWidget}
          {legendaryResistanceWidget}
        </ListGroup>
      );
    }

    let cardClass = "text-center w-auto";
    if(this.props.currentHealth > this.props.maxHealth) cardClass += " border-success bg-overheal";
    else if(this.props.currentHealth <= 0) cardClass += " border-danger bg-dead";
    else if(this.props.currentHealth <= (this.props.maxHealth/2)) cardClass += " border-warning bg-bloodied";

    return (
        <Card className={cardClass}>
          <Card.Body>
            <Card.Title> {this.props.displayName} </Card.Title>
            <Card.Text className="fs-1">
              {this.props.currentHealth} / {this.props.maxHealth}
            </Card.Text>
            {this.props.AC ?
              <Card.Text className="fs-5">
                AC {this.props.AC}
              </Card.Text>
            :''}
            <Form
              className="mt-2 d-flex flex-column"
              onSubmit={this.handleHealthSubmit}
            >
              <Form.Group controlId="hpDelta">
                <Form.Label visuallyHidden='true'>Change HP</Form.Label>
                <Form.Control
                  type="text"
                  pattern="[\-\+]?[0-9]*"
                  name="hpDelta"
                  value={this.state.hpDelta}
                  onChange={this.handleDelta}
                />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={this.handleHealthSubmit}
                className="mt-1">
                Update HP
              </Button>
            </Form>
          </Card.Body>
          { legendarySection }
          <Card.Body className='d-flex justify-content-around'>
            <Button
              variant="danger"
              onClick={() => this.props.removeMe(this.props.name, this.props.nameDelta)}>
              Remove
            </Button>
            {this.props.statblock.length ?
              <Button
                variant="secondary"
                onClick={this.handleInfo}>
                Info
              </Button>
            :''}
          </Card.Body>
        </Card>
    )
  }

}

export default Monster;
