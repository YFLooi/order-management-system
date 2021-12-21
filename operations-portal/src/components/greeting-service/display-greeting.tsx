import React, { Component } from "react";

interface Props {
  greetingService?: React.ReactNode;
}

class DisplayGreeting extends Component<Props> {
  greetingService: any;
  subscription: any;
  state: { [key: string]: any };

  constructor(props) {
    super(props);

    this.state = { greeting: "" };

    // declare method bindings
    this.receiveGreetings = this.receiveGreetings.bind(this);
    this.stopGreetings = this.stopGreetings.bind(this);

    // Declare binding to greetingService prop
    this.greetingService = props.greetingService;

    // Set up subscription to GreetingService.greetings() observable
    // Each time GreetingService.subject is updated, it in turn triggers setState here
    this.subscription = this.greetingService.greetings().subscribe((res) => {
      this.setState({ greeting: res });
    });
  }

  receiveGreetings() {
    console.log(`Enabling receipt of greetings`);
    this.subscription = this.greetingService.greetings().subscribe((res) => {
      this.setState({ greeting: res });
    });
  }
  stopGreetings() {
    console.log(`Stopping receipt of greetings`);
    this.subscription.unsubscribe();
  }

  render() {
    let greeting = this.state.greeting;
    return (
      <div>
        <h4>Display Greeting</h4>
        <div>{greeting}</div>

        {/* Terminates the subscription to the observable. New greetings will not
        be logged in state */}
        <button onClick={this.stopGreetings}>Stop receiving greetings</button>
        {/* Sets up subscription to the observable. New greetings will be logged in state */}
        <button onClick={this.receiveGreetings}>
          Start receiving greetings
        </button>
      </div>
    );
  }
}

export default DisplayGreeting;
