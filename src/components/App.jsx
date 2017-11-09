import 'normalize.css';
import './../assets/scss/App.scss';
import React from 'react';
import DataTable from './DataTable';
import DataViewController from './DataViewController';
import Paper from './Paper';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      attrsToDisplay: [],
      isLoading: true,
      errorMsg: '',
    }
  }

  componentDidMount() {
    // load data to state
    fetch('http://interviewtest.getguru.com/seismic/data.json')
    .then(response => response.json())
    .then(data => [data, Object.keys(data[0]).slice(0, 10)])
    .then(([data, attrsToDisplay]) => this.setState({
      data,
      attrsToDisplay,
      isLoading: false,
    }))
    .catch(err => {
      console.error(err);
      this.setState({
        isLoading: false,
        errorMsg: 'Unable to load data. Refresh to try again.'
      })
    });
  }

  updateAttrsToDisplay({target: {name, checked}}) {
    this.setState(({attrsToDisplay}) => {
      if (checked) return {attrsToDisplay: [...attrsToDisplay, name]};
      const newChoices = attrsToDisplay.filter(datum => !Object.is(datum, name))
      return {attrsToDisplay: newChoices}
    })
  }

  render() {
    return (
          <main>
            <div className="flex container">
              <h1 className="title-header">DataQuake</h1>
            </div>
            <Paper>
              <DataViewController
                data={this.state.data}
                attrsToDisplay={this.state.attrsToDisplay}
                handleChange={evt => this.updateAttrsToDisplay(evt)}
              />

              {this.state.isLoading &&
                <div>
                  <p>Loading...</p>
                </div>
              }

              {this.state.errorMsg && (
                <div>
                  <p>{this.state.errorMsg}</p>
                </div>
              )}

              {this.state.data[0] &&
                (<DataTable
                  data={this.state.data}
                  attrsToDisplay={this.state.attrsToDisplay}
                />)
              }

            </Paper>
          </main>
    );
  }
}

export default App;
