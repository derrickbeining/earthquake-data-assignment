import React from 'react';
import toTitleCase from '../utils/toTitleCase';

// ----------------------- HELPER(S) ----------------------------
const renderDataChoices = (data, attrsToDisplay) => {
  if (!data.length) return null;
  const attributes = Object.keys(data[0]);
  return attributes.sort().map(attr => {
    return (
    <div key={attr} className="attribute-toggle-container">
      <input
        id={attr}
        type="checkbox"
        name={attr}
        defaultChecked={attrsToDisplay.includes(attr)}
      />
      <label htmlFor={attr}>
        {toTitleCase(attr)}
      </label>
    </div>)
  })
}

// ------------------------- COMPONENT --------------------------------

const DataViewController = props => {
  const {
    data,
    attrsToDisplay,
    updateAttrsToDisplay,
    numRowsToDisplay,
    currPage,
    incrementResultsPage,
    decrementResultsPage,
  } = props;
  const resultsStart = numRowsToDisplay * currPage + 1;
  const remaining = data.length - resultsStart;
  const resultsEnd = remaining > numRowsToDisplay ?
    resultsStart + numRowsToDisplay - 1 :
    data.length;

  return (
    <div className="data-view-controller">

      <form>
        <fieldset name="dataChoices" onChange={updateAttrsToDisplay}>
          <legend>Select Columns</legend>
          <div className="attribute-toggle-area">
            {renderDataChoices(data, attrsToDisplay)}
          </div>
        </fieldset>
      </form>

      <div className="pagination-bar spread-contents">
        <button className="pagination-button" onClick={decrementResultsPage}>
          {'Prev'}
        </button>
        <span>Results {resultsStart} to {resultsEnd} of {data.length}</span>
        <button className="pagination-button" onClick={incrementResultsPage}>
          {'Next'}
        </button>
      </div>

    </div>
)}

export default DataViewController;
