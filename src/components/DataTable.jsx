import React from 'react';
import toTitleCase from '../utils/toTitleCase';
import convertDate from '../utils/convertDate';

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataOrderMap: DataTable.createDataOrderMap(props.data[0]),
      sortAttr: 'time',
      sortDirection: 'desc',
    }
    this.orderMapSorter = this.orderMapSorter.bind(this);
  }

  renderHeaders() {
    const {sortDirection, sortAttr} = this.state;
    return this.props.attrsToDisplay
      .sort(this.orderMapSorter)
      .map(attr => {
        const className = sortAttr === attr ? 'selected' : '';
        const sortPointer = sortDirection === 'desc' ? '↓' : '↑';
        return (
        <th
          key={attr}
          className={className}
          onClick={() => this.sortRowsBy(attr)}
        >
          {toTitleCase(attr)}&nbsp;
          {className === 'selected' ? sortPointer : null}
        </th>
      )
      })
  }

  renderRows() {
    const {sortAttr, sortDirection} = this.state;
    return this.props.data
      .sort(DataTable.createAttrSorter(sortAttr, sortDirection))
      .map(data => {
        return <tr key={data.id}>{this.renderData(data)}</tr>
      })
  }

  renderData(data) {
    const attributes = this.props.attrsToDisplay.sort(this.orderMapSorter);
    return attributes.map(attr => {
      if (attr === 'time' || attr === 'updated') {
        return <td key={attr}>{convertDate(data[attr])}</td>
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

  sortRowsBy(attrName) {
    const {sortAttr, sortDirection} = this.state;
    const toggled = sortDirection === 'desc' ? 'asc' : 'desc';
    if (sortAttr === attrName) return this.setState({sortDirection: toggled})
    else this.setState({sortAttr: attrName, sortDirection: 'desc'})
  }

  static createAttrSorter(attr, direction) {
    return direction === 'desc'
      ? DataTable.sortAttrsDesc.bind(null, attr)
      : DataTable.sortAttrsAsc.bind(null, attr);
  }

  static sortAttrsDesc(attr, curr, next) {
    if (next[attr] > curr[attr]) return 1;
    if (next[attr] < curr[attr]) return -1;
    return 0;
  }

  static sortAttrsAsc(attr, curr, next) {
    if (curr[attr] > next[attr]) return 1;
    if (curr[attr] < next[attr]) return -1;
    return 0;
  }

  static createDataOrderMap(data) {
    const map = {};
    let count = 0;
    Object.keys(data).forEach(attr => {
      map[attr] = count;
      count++;
    })
    return map;
  }

  orderMapSorter(attrA, attrB) {
    const orderMap = this.state.dataOrderMap;
    return orderMap[attrA] - orderMap[attrB];
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
