import React, { Component } from "react";

interface Props {
  // resolves issue of greetingService component type declaration being missing
  greetingService?: React.ReactNode;
}

class CreateGreeting extends Component<Props> {
  greetingService: any;
  state: { [key: string]: any };

  constructor(props: any) {
    super(props);
    this.state = { value: "" };
    this.greetingService = props.greetingService;

    this.handleChange = this.handleChange.bind(this);
    this.sendGreeting = this.sendGreeting.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  sendGreeting() {
    this.greetingService.emit(this.state.value);
  }

  render() {
    return (
      <div>
        <h4>Create Greeting</h4>
        <input type="text" onChange={this.handleChange} />
        <button onClick={this.sendGreeting}>Submit</button>
      </div>
    );
  }
}

export default CreateGreeting;
