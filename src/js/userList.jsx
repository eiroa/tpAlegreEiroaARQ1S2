'use strict';

const Survey = require('./survey');

import React from 'react';
import ReactDOM from 'react-dom';

const when = require( 'when' );
const client = require( './client' );
const root = '/api';
const follow = require( './follow' );

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Confirm from 'react-confirm-bootstrap';

class UserList extends React.Component { // definimos la estructura de una lista de encuestas

    constructor( props ) {
        super( props );
        this.state = { users: [],  pageSize: 20 };
        this.handleNavFirst = this.handleNavFirst.bind( this );
        this.handleNavPrev = this.handleNavPrev.bind( this );
        this.handleNavNext = this.handleNavNext.bind( this );
        this.handleNavLast = this.handleNavLast.bind( this );
        this.handleInput = this.handleInput.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleCreate = this.handleCreate.bind( this );
        this.onDeleteRow = this.onDeleteRow.bind(this);
        this.sleep = this.sleep.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.getSelectedRow = this.getSelectedRow.bind(this);
    }
    
    sleep(ms){
        //used for waiting execution of bootstrap table events
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    handleCreate( e ) {
        e.preventDefault();
        window.location = "#createUser";
    }
    
    onDeleteRow(row){
        return client( { method: 'DELETE', path: row.key }).then( response => {
            console.log("user deleted")
            this.sleep(150);
            window.location = "#users";
        }).then();
        
    }
    
    loadUsers() {
        
        
       return follow( client, root, ['users'] ).then( userCollection => {
            this.setState({users: userCollection.entity._embedded.users});
            console.log("users Loaded: "+ this.state.users);
        });
        
    }
    
    componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
        this.loadUsers();
    }

    handleInput( e ) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode( this.refs.pageSize ).value;
        if ( /^[0-9]+$/.test( pageSize ) ) {
            this.props.updatePageSize( pageSize );
        } else {
            ReactDOM.findDOMNode( this.refs.pageSize ).value = pageSize.substring( 0, pageSize.length - 1 );
        }
    }
    
    getSelectedRow(){
        return JSON.parse(localStorage.getItem('userSelected'));
    }
    
    handleAnswer(){
        this.handleAction(
                function(user){
                    console.log("not yet implemented");
                   // window.location = "#answerSurvey?key="+(survey.key);
                 }
        );
    }
    
    handleDelete() {
        this.handleAction(
                this.onDeleteRow
         );
    }
    
    handleAction(action){
        this.sleep(50).then(() => {
            if(this.getSelectedRow() != null){
                action(this.getSelectedRow());
           }
        });
    }

    handleNavFirst( e ) {
        e.preventDefault();
        this.props.onNavigate( this.props.links.first.href );
    }

    handleNavPrev( e ) {
        e.preventDefault();
        this.props.onNavigate( this.props.links.prev.href );
    }

    handleNavNext( e ) {
        e.preventDefault();
        this.props.onNavigate( this.props.links.next.href );
    }

    handleNavLast( e ) {
        e.preventDefault();
        this.props.onNavigate( this.props.links.last.href );
    }
    

    render() {
        var usersCopy = this.state.users.map ( 
                function(u){ 
                    return  {key:u._links.self.href,
                        name: u.name,
                        surname: u.surname,
                        studentId: u.studentId,
                        mail: u.mail,
                        _links: u._links
                     }
                });
        
        var keyRow = {key: ""};
        
        var getRow = function(){
            return keyRow;
        }
        
        var but =<div>    
        <Confirm
        onConfirm={this.handleDelete}
        body="Are you sure you want to delete this user?"
        confirmText="Confirm Delete"
        title="Deleting">
        <button className="btn btn-danger">Eliminar</button>
    </Confirm> 
    <button  style={{marginLeft:'5px'}} onClick={this.handleAnswer} className="btn btn-success"> Mostrar detalles </button> 
 </div>
        
        
        function actionsFormatter(cell, row){
            keyRow.key = row.key;
            return but
          }
        
        
        var navLinks = [];
//        if ( "last" in this.props.links ) {
//            navLinks.push( <button  className="btn btn-primary pull-right" key="last" onClick={this.handleNavLast}><span className="glyphicon glyphicon-forward"/> </button> );
//        }
//        
//        if ( "next" in this.props.links ) {
//            navLinks.push( <button  className="btn btn-primary pull-right" key="next" onClick={this.handleNavNext}><span className="glyphicon glyphicon-triangle-right"/> </button> );
//        }
//        
//        if ( "prev" in this.props.links ) {
//            navLinks.push( <button className="btn btn-primary pull-right" key="prev" onClick={this.handleNavPrev}><span className="glyphicon glyphicon-triangle-left" /> </button> );
//        }
//       
//        
//        if ( "first" in this.props.links ) {
//            navLinks.push( <button  className="btn btn-primary pull-right" key="first" onClick={this.handleNavFirst}><span className="glyphicon glyphicon-backward"/></button> );
//        }
        var selectRowProp = {
                mode: "radio", // or checkbox
                clickToSelect: true,
                bgColor: "rgb(208, 193, 200)",
                onSelect: onRowSelect
              };
        
        
        
        function onRowSelect(row, isSelected){
            console.log(row);
            console.log("selected: " + isSelected)
            keyRow.key = row.key;
            var dataToStore = JSON.stringify(row);
            localStorage.setItem('userSelected', dataToStore);

          }
        
        
     

        return (
            <div >
               
                <h4> Listado de usuarios </h4>
            <BootstrapTable 
            ref="table"
            data={usersCopy} 
            striped={true} 
            hover={true} 
            condensed={true} 
            selectRow={selectRowProp}
            >
                <TableHeaderColumn dataField="key" isKey={true} hidden={true} >Key</TableHeaderColumn>
                <TableHeaderColumn dataField="name"  dataSort={true} dataAlign="center">Nombre</TableHeaderColumn>
                <TableHeaderColumn dataField="surname"  dataSort={true} dataAlign="center">Apellido</TableHeaderColumn>
                <TableHeaderColumn dataField="studentId"  dataSort={true} dataAlign="center">Legajo</TableHeaderColumn>
                <TableHeaderColumn dataField="mail"  dataSort={true} dataAlign="center">Mail</TableHeaderColumn>
                <TableHeaderColumn dataFormat={actionsFormatter} dataAlign="center"></TableHeaderColumn>
            </BootstrapTable>
            
           <div>
                    
                
            <div style={{padding:'10px'}}>
            <button className="btn btn-success" onClick={this.handleCreate}> Crear nuevo usuario</button>
          </div>
                </div>
            </div>
        )}
   }
    
module.exports = UserList;