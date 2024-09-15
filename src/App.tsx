import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />);
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    // Initialize a guard variable to limit the number of fetches (if needed)
    let fetchCount = 0;

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Start a new interval to fetch data continuously
    this.intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState(prevState => ({
          data: [...prevState.data, ...serverResponds]
        }));
      });

      // Increment fetchCount and clear interval if necessary
      fetchCount++;
      if (fetchCount > 1000) {
        clearInterval(this.intervalId!);
      }
    }, 100); // Fetch data every 100ms
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              // Start streaming data
              this.setState({ showGraph: true }, () => {
                this.getDataFromServer();
              });
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
