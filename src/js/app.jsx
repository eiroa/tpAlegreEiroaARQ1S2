'use strict';

const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const when = require( 'when' );
const client = require( './client' );
const root = '/api';
const follow = require( './follow' );// function to hop multiple links by "rel"

// existen dos sintaxis para importar, el formato clasico ES5 impuesto por Node,  con require,
// y el formato moderno que propone React utilizando la especificacion ES6, import
// Se usan ambos solo a fines demostrativos
import { Router, Route, hashHistory, Link } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SkyLight from 'react-skylight';
import Confirm from 'react-confirm-bootstrap';

//IMPORTANTE:

/*
 * The structure of .entity and .headers 
 * is only pertinent when using rest.js 
 * as the REST library of choice. 
 * If you use a different library, 
 * you will have to adapt as necessary.
 */


class App extends React.Component {// creamos un componente de REACT

    constructor( props ) {
        super( props );
        this.state = { surveys: [], attributes: [], pageSize: 2, links: {}, key:"" };
        this.updatePageSize = this.updatePageSize.bind( this );
        this.onCreate = this.onCreate.bind( this );
        this.onUpdate = this.onUpdate.bind( this );
        this.onDelete = this.onDelete.bind( this );
        this.onDeleteDirect = this.onDeleteDirect.bind( this );
        this.onNavigate = this.onNavigate.bind( this );
        this.handleCreate = this.handleCreate.bind( this );
    }
    
    handleCreate( e ) {
        e.preventDefault();
        window.location = "#createSurvey";
    }

    loadFromServer( pageSize ) {
        follow( client, root, [
            { rel: 'surveys', params: { size: pageSize } }]
        ).then( surveyCollection => {
            return client( {
                method: 'GET',
                path: surveyCollection.entity._links.profile.href, //."entity"  entity hace referencia a la respuesta recibida por el servidor en este caso entity._links seria lo mismo que response._links, Atenti, surveyCollection representa la coleccion de surveys y no el response, el objeto entity es puesto por la funcion follow a surveyCollection
                headers: { 'Accept': 'application/schema+json' }
            }).then( schema => {
                this.schema = schema.entity;
                this.links = surveyCollection.entity._links;
                return surveyCollection;
            });
        }).then( surveyCollection => {
            return surveyCollection.entity._embedded.surveys.map( survey =>
                client( {
                    method: 'GET',
                    path: survey._links.self.href
                }) );
        }).then( surveyPromises => {
            return when.all( surveyPromises );
        }).then( surveys => {
            this.setState( {
                surveys: surveys,
                attributes: Object.keys( this.schema.properties ),
                pageSize: pageSize,
                links: this.links
            });
        });
    }

    onCreate( newSurvey ) {
        follow( client, root, ['surveys'] ).then( surveyCollection => {
            return client( {
                method: 'POST',
                path: surveyCollection.entity._links.self.href,
                entity: newSurvey,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then( response => {
            return follow( client, root, [
                { rel: 'surveys', params: { 'size': this.state.pageSize } }] );
        }).then( response => {
            this.onNavigate( response.entity._links.self.href );
        });
    }

    onUpdate( survey, updatedSurvey ) {
        client( {
            method: 'PUT',
            path: survey.entity._links.self.href,
            entity: updatedSurvey,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': survey.headers.Etag
            }
        }).then( response => {
            this.loadFromServer( this.state.pageSize );
        }, response => {
            if ( response.status.code === 412 ) {
                alert( 'DENIED: Unable to update ' +
                    survey.entity._links.self.href + '. Your copy is stale.' );
            }
        });
    }

    onDelete( survey ) {
        client( { method: 'DELETE', path: survey.entity._links.self.href }).then( response => {
            this.loadFromServer( this.state.pageSize );
        });
    }
    
    onDeleteDirect(link){
        client( { method: 'DELETE', path: link }).then( response => {
            this.loadFromServer( this.state.pageSize );
        });
    }

    updatePageSize( pageSize ) {
        if ( pageSize !== this.state.pageSize ) {
            this.loadFromServer( pageSize );
        }
    }

    onNavigate( navUri ) {
        client( {
            method: 'GET',
            path: navUri
        }).then( surveyCollection => {
            this.links = surveyCollection.entity._links;

            return surveyCollection.entity._embedded.surveys.map( survey =>
                client( {
                    method: 'GET',
                    path: survey._links.self.href
                })
            );
        }).then( surveyPromises => {
            return when.all( surveyPromises );
        }).then( surveys => {
            this.setState( {
                surveys: surveys,
                attributes: Object.keys( this.schema.properties ),
                pageSize: this.state.pageSize,
                links: this.links
            });
        });
    }

    componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
        this.loadFromServer( this.state.pageSize );
    }



    render() {
        return (
          <div>
              <div style={{padding:'10px'}}>
                <button className="btn btn-success" onClick={this.handleCreate}> Create new survey</button>
              </div>
            <div>
                <SurveyList surveys={this.state.surveys}
                    links={this.state.links}
                    key={this.state.key}
                    attributes={this.state.attributes}
                    pageSize={this.state.pageSize}
                    onNavigate={this.onNavigate}
                    onDelete={this.onDelete}
                    onDeleteDirect={this.onDeleteDirect}
                    onUpdate={this.onUpdate}
                    updatePageSize={this.updatePageSize}/>
            </div>
                </div>
        )
    }
}


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
    
    handleAnswer(e){
        e.preventDefault();
        
        
        if(this.refs.table.state.selectedRowKeys[0] != null){
            var key =this.refs.table.state.selectedRowKeys[0];
            window.location = "#answerSurvey?key="+key;
        
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
                bgColor: "rgb(208, 193, 213)",
                onSelect: onRowSelect
              };
        
        var optionsProp = {
                onDeleteRow : this.handleDelete,
                deleteText : "destroy"
              };
        

        function onRowSelect(row, isSelected){
            console.log(row);
            console.log("selected: " + isSelected)
            keyRow.key = row.key;
          }
        
        function getRowKey(){
            return this.refs.table.state.selectedRowKeys[0];
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
            options={optionsProp}>
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
        )
    }
}



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
            

class CareerList extends React.Component { // definimos la estructura de una lista de encuestas

    constructor( props ) {
        super( props );
        this.handleNavFirst = this.handleNavFirst.bind( this );
        this.handleNavPrev = this.handleNavPrev.bind( this );
        this.handleNavNext = this.handleNavNext.bind( this );
        this.handleNavLast = this.handleNavLast.bind( this );
        this.handleInput = this.handleInput.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
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
        
        var currentRow = null;
        
        var buttonDelete = <Confirm
        onConfirm={this.handleDelete}
        body="Are you sure you want to delete this survey?"
        confirmText="Confirm Delete"
        title="Deleting">
        <button className="btn btn-danger">Delete</button>
        </Confirm>
    
    var buttonAnswer  =  <a href="#answerSurvey">
    <button  style={{padding:'5px;'}}className="btn btn-success"> Answer </button> </a>
        
        var surveysCopy = this.props.surveys.map ( 
                function(s){ 
                    return  {key:s.entity._links.self.href,
                        name: s.entity.name,
                        description: s.entity.description,
                        entity: s.entity,
                        deleteFunction: function(){return this.props.onDeleteDirect}
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
        
        function actionsFormatter(cell, row){
            return <div>buttonDelete buttonAnswer</div>
          }
        
        
        function answerFormatter(cell, row){
            return <a href="#answerSurvey">
            <button  className="btn btn-success">Answer Survey</button>
            </a>
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
            data={surveysCopy} 
            striped={true} 
            hover={true} 
            condensed={true} 
            selectRow={selectRowProp}
            options={optionsProp}>
                <TableHeaderColumn dataField="key" isKey={true} hidden={true} >Key</TableHeaderColumn>
                <TableHeaderColumn dataField="name"  dataSort={true} dataAlign="center">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataAlign="center">Description</TableHeaderColumn>
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
        )
    }
}
            


class SubjectList extends React.Component { // definimos la estructura de una lista de encuestas

    constructor( props ) {
        super( props );
        this.handleNavFirst = this.handleNavFirst.bind( this );
        this.handleNavPrev = this.handleNavPrev.bind( this );
        this.handleNavNext = this.handleNavNext.bind( this );
        this.handleNavLast = this.handleNavLast.bind( this );
        this.handleInput = this.handleInput.bind( this );
        this.handleDelete = this.handleDelete.bind( this );
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
        
        var currentRow = null;
        
        var buttonDelete = <Confirm
        onConfirm={this.handleDelete}
        body="Are you sure you want to delete this survey?"
        confirmText="Confirm Delete"
        title="Deleting">
        <button className="btn btn-danger">Delete</button>
    </Confirm>
        
        var surveysCopy = this.props.surveys.map ( 
                function(s){ 
                    return  {key:s.entity._links.self.href,
                        name: s.entity.name,
                        description: s.entity.description,
                        entity: s.entity,
                        deleteFunction: function(){return this.props.onDeleteDirect}
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
        
        function deleteFormatter(cell, row){
            return buttonDelete;
          }
        
        
        function answerFormatter(cell, row){
            return <a href="#answerSurvey">
            <button  className="btn btn-success">Answer Survey</button>
            </a>
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
            data={surveysCopy} 
            striped={true} 
            hover={true} 
            condensed={true} 
            selectRow={selectRowProp}
            options={optionsProp}>
                <TableHeaderColumn dataField="key" isKey={true} hidden={true} >Key</TableHeaderColumn>
                <TableHeaderColumn dataField="name"  dataSort={true} dataAlign="center">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataAlign="center">Description</TableHeaderColumn>
                <TableHeaderColumn dataFormat={deleteFormatter} dataAlign="center">Actions</TableHeaderColumn>
                <TableHeaderColumn dataFormat={answerFormatter} dataAlign="center"  width="130">Actions</TableHeaderColumn>
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
        )
    }
}



class Survey extends React.Component {

    constructor( props ) {
        super( props );
        this.handleDelete = this.handleDelete.bind( this );
    }

    handleDelete() {
        this.props.onDelete( this.props.survey );
    }

    handleAnswer() {
        //this.props.onDelete(this.props.survey);
        alert( 'Not yet implemented...' );
    }

    render() {
        return (
            <tr>
                <td>{this.props.survey.entity.name}</td>
                <td>{this.props.survey.entity.description}</td>
                <td>
                    <UpdateDialog survey={this.props.survey}
                        attributes={this.props.attributes}
                        onUpdate={this.props.onUpdate}/>
                </td>
                <td><button onClick={this.handleDelete} className="btn btn-danger">Delete</button></td>

                <td><a href="#answerSurvey"><button className="btn btn-success">Answer Survey</button></a></td>
            </tr>
        )
    }
}


class UpdateDialog extends React.Component {

    constructor( props ) {
        super( props );
        this.handleSubmit = this.handleSubmit.bind( this );
    }

    handleSubmit( e ) {
        e.preventDefault();
        var updatedSurvey = {};
        this.props.attributes.forEach( attribute => {
            updatedSurvey[attribute] = ReactDOM.findDOMNode( this.refs[attribute] ).value.trim();
        });
        this.props.onUpdate( this.props.survey, updatedSurvey );
        window.location = "#";
    }

    render() {
        var inputs = this.props.attributes.map( attribute =>
            <p key={this.props.survey.entity[attribute]}>
                <input type="text" placeholder={attribute}
                    defaultValue={this.props.survey.entity[attribute]}
                    ref={attribute} className="field" />
            </p>
        );

        var dialogId = "updateSurvey"; //+ this.props.survey.entity._links.self.href;

        return (
            <div key={this.props.survey.entity._links.self.href}>
                <a href={"#" + dialogId}>Update</a>
                <div id={dialogId} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Update a survey</h2>

                        <form>
                            {inputs}
                            <button className="btn btn-info" onClick={this.handleSubmit}>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
};

class TestQuestion extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    <div className="user-poll-section">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <strong>Question: </strong>Introduccion a la programacion

                            </div>
                            <div className="panel-body">
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="group-poll"/>
                                        <strong>12 a 15</strong>
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="group-poll"/>
                                        <strong>9 a 12</strong>
                                    </label>
                                </div>
                                
                                <hr />
                                <h5 className="text-danger">Result Of User Votes: </h5>
                                <hr />
                                9 a 12 ( 60% ):
                                <div className="progress progress-striped active">
                                    <div className="progress-bar progress-bar-danger"
                                        role="progressbar" aria-valuenow="60"
                                    				aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                                        <span className="sr-only">60% Complete ( success ) </span>
                                    </div>
                                </div>
                                12 a 15 ( 40% ):
                                <div className="progress progress-striped active">
                                    <div className="progress-bar progress-bar-warning"
                                        role="progressbar" aria-valuenow="30"
                                        aria-valuemin="0" aria-valuemax="100" style={{ width: '30%' }} >
                                        <span className="sr-only">30% Complete ( success ) </span>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-footer">
                                <a href="#" className="btn btn-success btn-sm">
                                    <span className="glyphicon glyphicon-bell"></span> Save answer</a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        )
    }


}


class CreateSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                showCreateQuestionDialog: false,
                newSurvey: {questions:[]}
              };
        this.handleClickCreateQuestion = this.handleClickCreateQuestion.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.createSurvey = this.createSurvey.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        
        this.handleSurveyNameChange = this.handleSurveyNameChange.bind(this);
        this.handleSurveyDescriptionChange = this.handleSurveyDescriptionChange.bind(this);
    }
    
    
    
    
    handleNameChange(e){
        this.setState({questionName: e.target.value});
     }
    
    handleDescriptionChange(e){
        this.setState({questionDescription: e.target.value});
     }
    
    
    handleSurveyNameChange(e){
        this.setState({surveyName: e.target.value});
     }
    
    handleSurveyDescriptionChange(e){
        this.setState({surveyDescription: e.target.value});
     }
    
    
    onCreate( newSurvey ) {
        follow( client, root, ['surveys'] ).then( surveyCollection => {
            return client( {
                method: 'POST',
                path: surveyCollection.entity._links.self.href,
                entity: newSurvey,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then( response => {
            return follow( client, root, [
                { rel: 'surveys', params: { 'size': 2} }] );
        });
    }
    
    createSurvey(e){
        e.preventDefault();
        
        
        this.state.newSurvey.name = this.state.surveyName;
        this.state.newSurvey.description = this.state.surveyDescription;
        
        this.onCreate( this.state.newSurvey );


        // Navigate away from the dialog to hide it.
        window.location = "#";
    }
    
    createQuestion(e){
        e.preventDefault();
        
        var newQuestion = {};
        
        newQuestion.questionText = this.state.questionName;
        newQuestion.description = this.state.questionDescription;
        
        this.state.newSurvey.questions.push(newQuestion);

        // Navigate away from the dialog to hide it.
        this.setState({
            showCreateQuestionDialog: false
        });
        
        this.onCloseClicked();
    }
    
    handleClickCreateQuestion() {
        this.setState({
            showCreateQuestionDialog: true
        });
      }
    
    render() {
        
        
        var questionList = this.state.newSurvey.questions.map(q  => {
                        return <ListGroupItem href="#test">{q.questionText}</ListGroupItem>
                      });
    
        return (
            <div   className="panel panel-primary" id="panelNewIdea">
                <div className="panel-heading"><h3>Create new survey</h3></div>

                <div className="panel-body" id="formi" style={{ marginTop: '30px' }}>


                    <div className="form-group">
                        <input type="text"
                            className="form-control"
                            placeholder="Title"
                            name="surveyName"
                                onChange={this.handleSurveyNameChange}
                                required></input>
                    </div>
                    <div className="form-group">
                        <textarea form ="formi"
                            className="form-control"
                            cols="35"
                            wrap="soft"
                            name="surveyDescription"
                                onChange={this.handleSurveyDescriptionChange}
                                placeholder="Description"></textarea>

                    </div>
                    

                    <div className="form-group well">
                        <form className="form-inline" role="form" style={{ padding: '10px' }} name="urlForm">
                            <div style={{ padding: '5px' }}>
                                <button onClick={() => this.refs.simpleDialog.show()}  
                                className="btn btn-info pull-right" >
                                    Add question 
                                </button>
                                    
                                    <SkyLight hideOnOverlayClicked 
                                    ref="simpleDialog" 
                                        title="Create a new Text Question">
                                   <div  className="panel panel-primary" id="panelNewQuestion">
                                    <div className="panel-body" id="questionForm" style={{ marginTop: '10px' }}>


                                    <div className="form-inline" style={{padding:'10px'}}>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="QuestionText"
                                            name="questionName"
                                            onChange={this.handleNameChange}
                                            required></input>
                                    </div>
                                    <div className="form-group" style={{padding:'10px'}}>
                                        <textarea form ="formi"
                                            className="form-control"
                                            cols="35"
                                            wrap="soft"
                                            placeholder="Description"
                                                name="questionDescription"
                                                onChange={this.handleDescriptionChange}
                                            required></textarea>

                                    </div>
                                    
                                    <div className="form-group" style={{padding:'10px'}}>
                                        
                                        <div className="form-inline" style={{marginTop:'20px'}}>
                                        <button 
                                        onClick={this.createQuestion}
                                        className="btn btn-success" 
                                            style={{padding:'10px'}}
                                        > Create</button>
                                    </div>  
                                    

                                   </div>
                                </div>
                               </div>

                                  </SkyLight>
                                </div>

                        </form>

                        <div className="list-group">
                            <h4 >Survey Questions </h4>
                            <ListGroup>
                                {questionList}
                          </ListGroup>
                      
                        </div>
                        
                        
                    </div>
                    <button onClick={this.createSurvey} className='btn btn-success'> Create</button>
                </div>
            </div>
        )
    }
}
                                        


ReactDOM.render(
    (
        <Router history={hashHistory}>
            <Route path="/" component={App}/>
            <Route path="/createSurvey" component={CreateSurvey}/>
            <Route path="/careers" component={CareerList}/>
            <Route path="/subjects" component={SubjectList}/>
            <Route path="/question" component={TestQuestion}/>
            <Route path="/:key" name="answerSurvey" component={QuestionList} />
            
        </Router>
    ),
    document.getElementById( 'react' )
	)