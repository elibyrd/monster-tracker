import React from 'react';

class Monster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      maxHealth: props.maxHealth,
      currentHealth: props.currentHealth,
      hpDelta: 0,
      maxLegendaryActions: props.legendaryActions,
      currentLegendaryActions: props.legendaryActions,
      maxLegendaryResistances: props.legendaryResistances,
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
    this.setState({ currentHealth: this.state.currentHealth + parseInt(this.state.hpDelta) });

    event.preventDefault();
  }

  // Processes ticks and resets to legendary actions and resistances.
  handleLegendaryChange(event) {
    switch(event.target.className){
      case "legendaryActionTick":
        this.setState({currentLegendaryActions: this.state.currentLegendaryActions - 1});
        break;
      case "legendaryActionReset":
        this.setState({currentLegendaryActions: this.state.maxLegendaryActions});
        break;
      case "legendaryResistanceTick":
        this.setState({currentLegendaryResistances: this.state.currentLegendaryResistances - 1});
        break;
      case "legendaryResistanceReset":
        this.setState({currentLegendaryResistances: this.state.maxLegendaryResistances});
        break;
      default:
    }
  }

  render() {
    // Only render the legendary action widget if the monster has at least 1 legendary action.
    let legendaryActionWidget;
    if (this.state.maxLegendaryActions){
      legendaryActionWidget = (
        <div className="legendaryActionWidget">
          <div className="legendaryActionStatus">Legendary actions: {this.state.currentLegendaryActions} / {this.state.maxLegendaryActions}</div>
          <button
            className="legendaryActionTick"
            onClick={this.handleLegendaryChange}>
            Tick
          </button>
          <button
            className="legendaryActionReset"
            onClick={this.handleLegendaryChange}>
            Reset
          </button>
        </div>
      );
    }

    // Only render the legendary resistance widget if the monster has at least 1 legendary resistance.
    let legendaryResistanceWidget;
    if (this.state.maxLegendaryResistances){
      legendaryResistanceWidget = (
        <div className="legendaryResistanceWidget">
          <div className="legendaryResistanceStatus">Legendary resistances: {this.state.currentLegendaryResistances} / {this.state.maxLegendaryResistances}</div>
          <button
            className="legendaryResistanceTick"
            onClick={this.handleLegendaryChange}>
            Tick
          </button>
          <button
            className="legendaryResistanceReset"
            onClick={this.handleLegendaryChange}>
            Reset
          </button>
        </div>
      );
    }

    return (
      <div
        className="monsterBox"
      >
        <div>{this.props.name+" "+(this.props.nameDelta + 1)}</div>
        <div
          className="healthBox"
          style={{
            color: this.state.currentHealth > (this.state.maxHealth/2) ? 'green' : 'red'
          }}
        >
          {this.state.currentHealth} / {this.state.maxHealth}
        </div>
        <form
          className="monsterHealthForm"
          onSubmit={this.handleHealthSubmit}
        >
          <label>
            <span className='sr-only'>Change HP:</span>
            <input
              type="text"
              name="hpDelta"
              value={this.state.hpDelta}
              onChange={this.handleDelta}
            />
          </label>
          <button
            onClick={this.handleHealthSubmit}>
            Update HP
          </button>
        </form>
        { legendaryActionWidget }
        { legendaryResistanceWidget }
        <button
          className='removeMonsterButton'
          onClick={() => this.props.removeMe(this.props.name, this.props.nameDelta)}>
          Remove
        </button>
      </div>
    )
  }

}

export default Monster;
