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
const CreateSubject = require('./createSubject');
const CreateCareer = require('./createCareer');
const CreateUser = require('./createUser');
const TestQuestion = require('./testQuestion');
const UserList = require('./userList');
const CareerList = require('./careerList');
const SubjectList = require('./subjectList');
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
        this.onDeleteRow = this.onDeleteRow.bind( this );
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
    
    onDeleteRow(row){
        //assume key is the self link
        client( { method: 'DELETE', path: row.key }).then( response => {
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
              
            <div>
            <h2 className="text-center"> Encuestas disponibles </h2>
                <SurveyList surveys={this.state.surveys}
                    links={this.state.links}
                    key={this.state.key}
                    attributes={this.state.attributes}
                    pageSize={this.state.pageSize}
                    onNavigate={this.onNavigate}
                    onDelete={this.onDelete}
                    onDeleteDirect={this.onDeleteDirect}
                    onDeleteRow = {this.onDeleteRow}
                    onUpdate={this.onUpdate}
                    updatePageSize={this.updatePageSize}/>
            </div>
                
                <div style={{padding:'10px'}}>
                <button className="btn btn-success" onClick={this.handleCreate}> Crear nueva encuesta</button>
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
            <Route path="/createCareer" component={CreateCareer}/>
            <Route path="/createSubject" component={CreateSubject}/>
            <Route path="/createUser" component={CreateUser}/>
            <Route path="/careers" component={CareerList}/>
            <Route path="/subjects" component={SubjectList}/>
            <Route path="/question" component={TestQuestion}/>
            <Route path="/users" component={UserList}/>
            <Route path="/:key" name="answerSurvey" component={QuestionList} />
        </Router>
    ),
    document.getElementById( 'react' )
	)