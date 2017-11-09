import React from 'react';
import toTitleCase from '../utils/toTitleCase';

const DataViewController = ({data, attrsToDisplay, handleChange}) => {

  const renderDataChoices = () => {
    if (!data[0]) return null;
    const attributes = Object.keys(data[0]);
    return attributes.sort().map((attr, idx) => {
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

  return (
      <form>
        <fieldset
          name="dataChoices"
          onChange={handleChange}
        >
          <legend>Select Data Attributes</legend>
          <div className="attribute-toggle-area">
            {renderDataChoices()}
          </div>
        </fieldset>
      </form>
)}

export default DataViewController;
