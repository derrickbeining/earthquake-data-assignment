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
      attrsToDisplay: ['id', 'time', 'place', 'mag'],
      data: [],
      errorMsg: '',
      isLoading: true,
      numRowsToDisplay: 20,
      currentResultsPage: 0
    }
    this.updateAttrsToDisplay = this.updateAttrsToDisplay.bind(this);
    this.incrementResultsPage = this.incrementResultsPage.bind(this);
    this.decrementResultsPage = this.decrementResultsPage.bind(this);
  }

  componentDidMount() {
    // load data to state
    fetch('http://interviewtest.getguru.com/seismic/data.json', {mode: 'cors'})
    .then(response => response.json())
    .then(data => this.setState({data, isLoading: false}))
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

  incrementResultsPage() {
    const totalRows = this.state.data.length;
    const totalPages = Math.ceil(totalRows / this.state.numRowsToDisplay) - 1;
    if (this.state.currentResultsPage < totalPages) {
      this.setState(prevState => ({currentResultsPage: prevState.currentResultsPage + 1}))
    }
  }

  decrementResultsPage() {
    if (this.state.currentResultsPage > 0) {
      this.setState(prevState => ({currentResultsPage: prevState.currentResultsPage - 1}))
    }
  }

  render() {
    return (
          <main>
            <div className="flex container">
              <h1 className="title-header">Earthquake Data</h1>
            </div>
            <Paper>
              <DataViewController
                attrsToDisplay={this.state.attrsToDisplay}
                currPage={this.state.currentResultsPage}
                data={this.state.data}
                decrementResultsPage={this.decrementResultsPage}
                incrementResultsPage={this.incrementResultsPage}
                numRowsToDisplay={this.state.numRowsToDisplay}
                updateAttrsToDisplay={this.updateAttrsToDisplay}
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
                  attrsToDisplay={this.state.attrsToDisplay}
                  currPage={this.state.currentResultsPage}
                  data={this.state.data}
                  numRowsToDisplay={this.state.numRowsToDisplay}
                />)
              }

            </Paper>
          </main>
    );
  }
}

export default App;
