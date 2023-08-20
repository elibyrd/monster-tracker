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
      currentLegendaryActions: props.legendaryActions,
      currentLegendaryResistances: props.legendaryResistances,
    };

    this.handleDelta = this.handleDelta.bind(this);
    this.handleHealthSubmit = this.handleHealthSubmit.bind(this);
    this.handleLegendaryChange = this.handleLegendaryChange.bind(this);
  }

  // Stores the value entered in the HP update box to state.
  handleDelta(event) {
    this.setState({hpDelta: event.target.value});
  }

  // Alters monster's health by the value stored from the HP update box.
  handleHealthSubmit(event) {
    event.preventDefault();

    let hpDelta = parseInt(this.state.hpDelta);
    // Check for invalid data before proceeding.
    if(Number.isNaN(hpDelta)) return;

    if(this.state.hpDelta.indexOf('+') === 0 || this.state.hpDelta.indexOf('-') === 0){
      this.setState({ currentHealth: this.state.currentHealth + hpDelta });
      return;
    }

    this.setState({ currentHealth: hpDelta });
  }

  // Processes ticks and resets to legendary actions and resistances.
  handleLegendaryChange(action) {
    switch(action){
      case "legendaryActionTick":
        this.setState({currentLegendaryActions: this.state.currentLegendaryActions - 1});
        break;
      case "legendaryActionReset":
        this.setState({currentLegendaryActions: this.props.legendaryActions});
        break;
      case "legendaryResistanceTick":
        this.setState({currentLegendaryResistances: this.state.currentLegendaryResistances - 1});
        break;
      case "legendaryResistanceReset":
        this.setState({currentLegendaryResistances: this.props.legendaryResistances});
        break;
      default:
    }
  }

  render() {
    // Only render the legendary action widget if the monster has at least 1 legendary action.
    let legendaryActionWidget;
    if (this.props.legendaryActions){
      legendaryActionWidget = (
        <ListGroup.Item>
          <div>Legendary actions</div>
          <div className="fs-3">{this.state.currentLegendaryActions} / {this.props.legendaryActions}</div>
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
    if (this.props.legendaryResistances){
      legendaryResistanceWidget = (
        <ListGroup.Item>
          <div>Legendary resistances</div>
          <div className="fs-3">{this.state.currentLegendaryResistances} / {this.props.legendaryResistances}</div>
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
        <ListGroup variant="flush">
          {legendaryActionWidget}
          {legendaryResistanceWidget}
        </ListGroup>
      );
    }

    let cardClass = "text-center w-auto";
    if(this.state.currentHealth <= (this.props.maxHealth/2)) cardClass += " border-danger text-danger";

    return (
        <Card className={cardClass}>
          <Card.Body>
            <Card.Title>{this.props.displayName}</Card.Title>
            <Card.Text className="fs-1">
              {this.state.currentHealth} / {this.props.maxHealth}
            </Card.Text>
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
          <Card.Body>
            <Button
              variant="danger"
              onClick={() => this.props.removeMe(this.props.name, this.props.nameDelta)}>
              Remove
            </Button>
          </Card.Body>
        </Card>
    )
  }

}

export default Monster;
