import React from "react";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import './Tableau.css';
import 'rsuite-table/dist/css/rsuite-table.css'; // or 'rsuite-table/dist/css/rsuite-table.css';

var dataUpstone = require( './resultat/upstone.json');
var dataClub = require( './resultat/clubFunding.json');
var dataPremiere = require( './resultat/lapremierebrique.json');

var allData =[...dataUpstone, ...dataClub, ...dataPremiere];
export default class SortTable extends React.Component {
  constructor(props) {
    super(props);
    const data = allData;
    this.state = {
      addColumn: false,
      data
    };
    this.handleSortColumn = this.handleSortColumn.bind(this);
  }

  getData() {
    const { data, sortColumn, sortType } = this.state;

    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  }

  handleSortColumn(sortColumn, sortType) {
    this.setState({
      loading: true
    });

    setTimeout(() => {
      this.setState({
        sortColumn,
        sortType,
        loading: false
      });
    }, 500);
  }

  render() {
    return (
      <div>
        <Table
          bordered
          cellBordered
          height={900}
          data={this.getData()}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          onSortColumn={this.handleSortColumn}
          loading={this.state.loading}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
         <Column align="center"  resizable sortable>
          <HeaderCell>Plateforme</HeaderCell>
          <Cell dataKey="plateform" />
        </Column>
        <Column align="center"   sortable width={200}>
          <HeaderCell>Lien</HeaderCell>
          <Cell dataKey="img" >
              {(rowData, rowIndex) => {
              return <img  src={`${rowData.img}`} alt="projet"/>;
            }}
          </Cell>
        </Column>
        <Column align="center"  resizable sortable>
          <HeaderCell>Nom</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column align="center" fixed resizable sortable>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="state" />
        </Column>
        <Column align="center"  resizable sortable>
          <HeaderCell>Gain (%)</HeaderCell>
          <Cell dataKey="profit" >
              {(rowData, rowIndex) => {
              return <span>{rowData.profit} %</span>;
            }}
            </Cell>
        </Column>
        <Column align="center"  resizable sortable>
          <HeaderCell>Durée (Mois)</HeaderCell>
          <Cell dataKey="periode" />
        </Column>
        <Column align="center"  resizable sortable>
          <HeaderCell>Lien</HeaderCell>
          <Cell dataKey="url" >
              {(rowData, rowIndex) => {
              return <a target="_blank" href={`${rowData.url}`}>Se rendre sur ${rowData.plateform}</a>;
            }}
          </Cell>
        </Column>
        </Table>
      </div>
    );
  }
}
