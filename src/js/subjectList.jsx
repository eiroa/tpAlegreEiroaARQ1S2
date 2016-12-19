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

class SubjectList extends React.Component { // definimos la estructura de una lista de encuestas

    constructor( props ) {
        super( props );
        this.state = { subjects: [],  pageSize: 20 };
        this.handleNavFirst = this.handleNavFirst.bind( this );
        this.handleNavPrev = this.handleNavPrev.bind( this );
        this.handleNavNext = this.handleNavNext.bind( this );
        this.handleNavLast = this.handleNavLast.bind( this );
        this.handleInput = this.handleInput.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.hanldeCreate = this.handleCreate.bind(this);
        this.sleep = this.sleep.bind(this);
        this.loadSubjects = this.loadSubjects.bind(this);
        this.getSelectedRow = this.getSelectedRow.bind(this);
    }
    
    sleep(ms){
        //used for waiting execution of bootstrap table events
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    loadSubjects() {
        
        
       return follow( client, root, ['subjects'] ).then( subjectCollection => {
            this.setState({subjects: subjectCollection.entity._embedded.subjects});
            console.log("subjects Loaded: "+ this.state.subjects);
        });
        
    }
    
    componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
        this.loadSubjects();
    }
    
    handleCreate( e ) {
        e.preventDefault();
//        window.location = "#createSubject";
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
        return JSON.parse(localStorage.getItem('subjectSelected'));
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
                this.props.onDeleteRow
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
        var subjectsCopy = this.state.subjects.map ( 
                function(u){ 
                    return  {key:u._links.self.href,
                        name: u.name,
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
        body="¿Desea elimianr esta materia?"
        confirmText="Confirmar"
        title="Eliminar">
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
            localStorage.setItem('subjetSelected', dataToStore);

          }
        
        
     

        return (
            <div >
               
                <h4> Listado de materias </h4>
            <BootstrapTable 
            ref="table"
            data={subjectsCopy} 
            striped={true} 
            hover={true} 
            condensed={true} 
            selectRow={selectRowProp}
            >
                <TableHeaderColumn dataField="key" isKey={true} hidden={true} >Key</TableHeaderColumn>
                <TableHeaderColumn dataField="name"  dataSort={true} dataAlign="center">Nombre</TableHeaderColumn>
                <TableHeaderColumn dataFormat={actionsFormatter} dataAlign="center"></TableHeaderColumn>
            </BootstrapTable>
            
           <div>
                    
                
            <div className="form-inline" style={{padding:'10px'}}>
                Page size
                <input ref="pageSize"
                    type="number"
                    min="1" max="50" step="1" 
                    className="form-control"
                    name="pagination"
                    onInput={this.handleInput}
                    defaultValue={2}
                    ></input>
            </div>
            <div style={{padding:'10px'}}>
            <button className="btn btn-success" onClick={this.handleCreate}> Crear nueva materia</button>
          </div>
                </div>
            </div>
        )}
   }
    
module.exports = SubjectList;