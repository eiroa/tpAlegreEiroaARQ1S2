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

//ADVERTENCIA: para importar los componentes propios, utilizamos la sintaxis ES5 con require

//main components
const Survey = require('./survey');
const SurveyList = require('./surveyList');
const QuestionList = require('./questionList');
const CreateSurvey = require('./createSurvey');
const TestQuestion = require('./testQuestion');
//

//vendor modules
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
             this.props.onDeleteDirect(this.refs.table.state.selectedRowKeys[0]);Sur
         
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