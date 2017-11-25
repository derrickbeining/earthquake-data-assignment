import React from 'react';
import Popover from './Popover';
import toTitleCase from '../utils/toTitleCase';
import convertDate from '../utils/convertDate';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // defines an order of priority in which columns should appear when selected
      colOrderMap: DataTable.createColOrderMap(props.data[0]),
      sortAttr: 'mag',
      sortDirection: 'desc',
      filters: {}, // e.g. {time: 'septem', place: 'mex', ...etc}
    }

    this.expandedAttrNameMap = {place: 'Location', mag: 'Magnitude'};
    this.sortByColOrderMap = this.sortByColOrderMap.bind(this);
    this.sortRowsBy = this.sortRowsBy.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
  }

  sortByColOrderMap(attrA, attrB) {
    const {colOrderMap} = this.state;
    return colOrderMap[attrA] - colOrderMap[attrB];
  }

  formatAttrName(attr) {
    if (this.expandedAttrNameMap[attr]) return this.expandedAttrNameMap[attr];
    else return toTitleCase(attr);
  }

  renderHeaders() {
    const {sortDirection, sortAttr} = this.state;
    const sortPointer = sortDirection === 'desc' ? '↓' : '↑';
    return this.props.attrsToDisplay
      .sort(this.sortByColOrderMap)
      .map(attr => {
        const className = sortAttr === attr ? 'selected' : '';
        const sortRowsByAttr = this.sortRowsBy.bind(this, attr);
        return (
          // this could probably benefit from being extracted into its own component
          <th key={attr} data-name={attr} className={className} onClick={sortRowsByAttr}>
            <div data-name={attr}>
              <Popover
                triggerType="icon"
                icon="filter"
                triggerClassName="th-icon"
              >
                <h4>Filter by {this.formatAttrName(attr)}</h4>
                <input
                  type="text"
                  name={attr}
                  value={this.state.filters[attr] || ''}
                  onChange={this.updateFilters}
                />
              </Popover> &nbsp;
              <span data-name={attr}>{this.formatAttrName(attr)}</span> &nbsp;
              {className === 'selected' ? sortPointer : null}
            </div>
          </th>
      )
      })
  }

  newFiltersMatcher() {
    const {filters} = this.state;
    const columns = Object.keys(this.state.filters);
    return (row) => {
      return columns.every(column => {
        if (!filters[column]) return true;
        let filter = new RegExp(`/${filters[column]}/`, 'i');
        if (column === 'time' || column === 'updated') {
          return filter.test(convertDate(row[column]));
        } else {
          return filter.test(row[column]);
        }
      });
    }
  }

  renderRows() {
    const {sortAttr, sortDirection, filters} = this.state;
    const {numRowsToDisplay, currPage} = this.props;
    const startRow = numRowsToDisplay * currPage;
    let {data} = this.props;
    if (Object.keys(filters).length) data = data.filter(this.newFiltersMatcher());
    return data
      .sort(DataTable.createAttrSorter(sortAttr, sortDirection))
      .slice(startRow, startRow + numRowsToDisplay)
      .map(datum => {
        return <tr key={datum.id}>{this.renderCell(datum)}</tr>
      })
  }

  renderCell(data) {
    const sortedAttrs = this.props.attrsToDisplay.sort(this.sortByColOrderMap);
    const LocationCell = ({attr}) => (
      <td className="spread-contents">
        {data[attr]}&nbsp;
        <Popover triggerType="button" btnText="Details" triggerClassName="popover-button">
          <p>Coordinates:</p>
          <p>{data.latitude}, {data.longitude}</p>
        </Popover>
      </td>
    );

    return sortedAttrs.map(attr => {
      if (attr === 'time' || attr === 'updated') {
        return <td key={attr}>{convertDate(data[attr])}</td>
      } else if (attr === 'place') {
        return <LocationCell key={attr} attr={attr} />
      } else {
        return <td key={attr}>{data[attr]}</td>
      }
    })
  }

  renderCols() {
    return this.props.attrsToDisplay.map(attr => (
      <col key={attr} />
    ));
  }

  sortRowsBy(attrName, evt) {
    // there's almost certainly a better way to do this; the table headers fire this
    // onClick, but their nested Popover and filter icon would trigger it too bc of
    // bubbling, so I'm using data- attributes as a quick solution to validate event
    // targets. Not ideal, but it works.
    if (evt.target.dataset.name === attrName) {
      const {sortAttr, sortDirection} = this.state;
      const toggled = sortDirection === 'desc' ? 'asc' : 'desc';
      if (sortAttr === attrName) return this.setState({sortDirection: toggled})
      else this.setState({sortAttr: attrName, sortDirection: 'desc'})
    }
  }

  updateFilters(evt) {
    const {name, value} = evt.target;
    let newFilters;
    this.setState(prevState => {
      if (value.length === 0) {
        delete prevState.filters[name]
        newFilters = Object.assign({}, prevState.filters);
      } else {
        newFilters = Object.assign({}, prevState.filters, {[name]: value});
      }
      return ({filters: newFilters})
    })
  }

  static createAttrSorter(attr, direction) {
    return direction === 'desc'
      ? DataTable.sortAttrsDesc.bind(null, attr)
      : DataTable.sortAttrsAsc.bind(null, attr);
  }

  static sortAttrsDesc(attr, curr, next) {
    if (next[attr] > curr[attr]) return 1;
    if (next[attr] < curr[attr]) return -1;
    if (next.time  > curr.time)  return 1;
    if (next.time  < curr.time)  return -1;
    return 0;
  }

  static sortAttrsAsc(attr, curr, next) {
    if (curr[attr] > next[attr]) return 1;
    if (curr[attr] < next[attr]) return -1;
    if (curr.time  > next.time)  return 1;
    if (curr.time  < next.time)  return -1;
    return 0;
  }

  static createColOrderMap(data) {
    // default priorities
    const map = {id: 0, time: 1, place: 2, mag: 3};
    let count = 4;
    // sort rest by order of appearance on JSON data
    Object.keys(data).forEach(attr => {
      if (map[attr] === undefined) {
        map[attr] = count;
        count++;
      }
    })
    return map;
  }

  render() {
    return (
        <div className="table-container x-scroll-container">
          <table className="x-scroll">
          <colgroup>
            {this.renderCols()}
          </colgroup>
              <thead>
                <tr>
                  {this.renderHeaders()}
                </tr>
              </thead>


            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
    )
  }
}

export default DataTable;
