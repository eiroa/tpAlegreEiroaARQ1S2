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

class SurveyList extends React.Component { // definimos la estructura de una lista de encuestas

    constructor( props ) {
        super( props );
        this.handleNavFirst = this.handleNavFirst.bind( this );
        this.handleNavPrev = this.handleNavPrev.bind( this );
        this.handleNavNext = this.handleNavNext.bind( this );
        this.handleNavLast = this.handleNavLast.bind( this );
        this.handleInput = this.handleInput.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
        this.handleAnswer = this.handleAnswer.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.sleep = this.sleep.bind(this);
        this.getSelectedRow = this.getSelectedRow.bind(this);
    }
    
    sleep(ms){
        //used for waiting execution of bootstrap table events
        return new Promise((resolve) => setTimeout(resolve, ms));
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
        return JSON.parse(localStorage.getItem('surveySelected'));
    }
    
    handleAnswer(){
        this.handleAction(
                function(survey){
                    window.location = "#answerSurvey?key="+(survey.key);
                 }
        );
    }
    
    handleDelete() {
        this.handleAction(
                this.props.onDeleteRow
         );
    }
    
    handleAction(action){
        this.sleep(75).then(() => {
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
        var surveysCopy = this.props.surveys.map ( 
                function(s){ 
                    return  {key:s.entity._links.self.href,
                        name: s.entity.name,
                        description: s.entity.description,
                        entity: s.entity
                     }
                });
        
        var surveys = this.props.surveys.map( survey =>
            <Survey key={survey.entity._links.self.href}
                survey={survey}
                attributes={this.props.attributes}
                onUpdate={this.props.onUpdate}
                onDelete={this.props.onDelete}
                onDeleteDirect={this.props.onDeleteDirect}/>
            
        );
        
        var keyRow = {key: ""};
        
        var getRow = function(){
            return keyRow;
        }
        
        var but =<div>    
        <Confirm
        onConfirm={this.handleDelete}
        body="Are you sure you want to delete this survey?"
        confirmText="Confirm Delete"
        title="Deleting">
        <button className="btn btn-danger">Delete</button>
    </Confirm> 
    <button  style={{marginLeft:'5px'}} onClick={this.handleAnswer} className="btn btn-success"> Answer </button> 
 </div>
        
        
        function actionsFormatter(cell, row){
            keyRow.key = row.key;
            return but
          }
        
        
        var navLinks = [];
        if ( "last" in this.props.links ) {
            navLinks.push( <button  className="btn btn-primary pull-right" key="last" onClick={this.handleNavLast}><span className="glyphicon glyphicon-forward"/> </button> );
        }
        
        if ( "next" in this.props.links ) {
            navLinks.push( <button  className="btn btn-primary pull-right" key="next" onClick={this.handleNavNext}><span className="glyphicon glyphicon-triangle-right"/> </button> );
        }
        
        if ( "prev" in this.props.links ) {
            navLinks.push( <button className="btn btn-primary pull-right" key="prev" onClick={this.handleNavPrev}><span className="glyphicon glyphicon-triangle-left" /> </button> );
        }
       
        
        if ( "first" in this.props.links ) {
            navLinks.push( <button  className="btn btn-primary pull-right" key="first" onClick={this.handleNavFirst}><span className="glyphicon glyphicon-backward"/></button> );
        }
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
            localStorage.setItem('surveySelected', dataToStore);

          }
        
        
     

        return (
            <div >
               
                
            <BootstrapTable 
            ref="table"
            data={surveysCopy} 
            striped={true} 
            hover={true} 
            condensed={true} 
            selectRow={selectRowProp}
            >
                <TableHeaderColumn dataField="key" isKey={true} hidden={true} >Key</TableHeaderColumn>
                <TableHeaderColumn dataField="name"  dataSort={true} dataAlign="center">Name</TableHeaderColumn>
                <TableHeaderColumn dataFormat={actionsFormatter} dataAlign="center">Actions</TableHeaderColumn>
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
                    defaultValue={this.props.pageSize}
                    ></input>
                    {navLinks}
            </div>
            
                </div>
            </div>
        )}
   }
    
module.exports = SurveyList;