import React from 'react';

const convertDate = dateString => {
  return new Date(dateString).toUTCString().split(', ')[1];
}

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
          {`${attr[0].toUpperCase()}${attr.slice(1)}`}&nbsp;
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

  static createAttrSorter(attrName, direction) {
    if (direction === 'desc') {
      return (curr, next) => {
        if (next[attrName] > curr[attrName]) return 1;
        if (next[attrName] < curr[attrName]) return -1;
        return 0;
      }
    } else {
      return (curr, next) => {
        if (curr[attrName] > next[attrName]) return 1;
        if (curr[attrName] < next[attrName]) return -1;
        return 0;
      }
    }
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