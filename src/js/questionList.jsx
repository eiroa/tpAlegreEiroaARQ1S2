'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const when = require( 'when' );
const client = require( './client' );
const root = '/api';
const follow = require( './follow' );

class QuestionList extends React.Component { // definimos la estructura de una lista de encuestas

        constructor( props ) {
                    super( props );
                    this.state = { questions: []};
                    this.handleNavFirst = this.handleNavFirst.bind( this );
                    this.handleNavPrev = this.handleNavPrev.bind( this );
                    this.handleNavNext = this.handleNavNext.bind( this );
                    this.handleNavLast = this.handleNavLast.bind( this );
                    this.handleInput = this.handleInput.bind( this );
                    this.handleDelete = this.handleDelete.bind( this );
                    this.loadSurvey = this.loadSurvey.bind(this);
                    this.handleAnswer = this.handleAnswer.bind(this);
                }
                
        componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
            this.loadSurvey( this.props.location.query.key );
        }
                loadSurvey(key ) {
                    client( {
                        method: 'GET',
                        path: key
                    }).then( response => {
                        this.setState( {
                            survey: response.entity,
                            questions : response.entity.questions
                        });
                    });
                }
                
                handleAnswer(e){
                    e.preventDefault();
                    
                        window.location = "#question";
                    
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
                
                handleDelete() {
                    if(this.refs.table.state.selectedRowKeys[0] != null){
                         this.props.onDeleteDirect(this.refs.table.state.selectedRowKeys[0]);
                     
                    }
                    
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
                    
                    
                    
                    var but =<div>    
                <button  style={{marginLeft:'5px'}} className="btn btn-success" onClick={this.handleAnswer}> Answer question</button> 
             </div>
                    
                    
                    function actionsFormatter(cell, row){
                        return but
                      }
                    
                    
                    var questions = 
                            this.state.questions.map ( 
                                    function(q,i){ 
                                        return  {key:i,
                                            name:q.questionText,
                                            options: q.options
                                        
                                         }
                                    });
                        
                        
                    
                    
                    var navLinks = [];
                    var selectRowProp = {
                            mode: "radio", // or checkbox
                            clickToSelect: true,
                            bgColor: "rgb(238, 193, 213)",
                            onSelect: onRowSelect
                          };
                    
                    var optionsProp = {
                            onDeleteRow : this.handleDelete,
                            deleteText : "destroy"
                          };
                    
                    function onRowSelect(row, isSelected){
                        console.log(row);
                        console.log("selected: " + isSelected)
                      }



                    return (
                        <div >
                           
                        <BootstrapTable 
                        ref="table"
                        data={questions} 
                        striped={true} 
                        hover={true} 
                        condensed={true}
                        >
                            <TableHeaderColumn dataField="key" isKey={true} hidden={true}>Key</TableHeaderColumn>
                            <TableHeaderColumn dataField="name" >Question</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={actionsFormatter} dataAlign="center">Actions</TableHeaderColumn>
                        </BootstrapTable>
                       
                       <div>
                                
                            </div>
                        </div>
                    )
                }
         }

module.exports = QuestionList;