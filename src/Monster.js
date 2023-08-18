import React from 'react';

class Monster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      maxHealth: props.maxHealth,
      currentHealth: props.currentHealth,
      hpDelta: 0
    };

    this.handleDelta = this.handleDelta.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDelta(event) {
    this.setState({hpDelta: event.target.value});
  }

  handleSubmit(event) {
    this.setState({ currentHealth: this.state.currentHealth + parseInt(this.state.hpDelta) });

    event.preventDefault();
  }

  render() {
    return (
      <div
        key={this.state.name}
        className="monsterBox"
      >
        <div>{this.state.name}</div>
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
          onSubmit={this.handleSubmit}
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
            onClick={this.handleSubmit}>
            Update HP
          </button>
        </form>
        <button
          className='removeMonsterButton'
          onClick={() => this.props.removeMe(this.state.name)}>
          Remove
        </button>
      </div>
    )
  }

}

export default Monster;
