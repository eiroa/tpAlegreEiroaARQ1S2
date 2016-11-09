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
import { Router, Route, hashHistory } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SkyLight from 'react-skylight';
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
        this.state = { surveys: [], attributes: [], pageSize: 2, links: {} };
        this.updatePageSize = this.updatePageSize.bind( this );
        this.onCreate = this.onCreate.bind( this );
        this.onUpdate = this.onUpdate.bind( this );
        this.onDelete = this.onDelete.bind( this );
        this.onNavigate = this.onNavigate.bind( this );
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
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <SurveyList surveys={this.state.surveys}
                    links={this.state.links}
                    attributes={this.state.attributes}
                    pageSize={this.state.pageSize}
                    onNavigate={this.onNavigate}
                    onDelete={this.onDelete}
                    onUpdate={this.onUpdate}
                    updatePageSize={this.updatePageSize}/>
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
    }

    // tag::handle-page-size-updates[]
    handleInput( e ) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode( this.refs.pageSize ).value;
        if ( /^[0-9]+$/.test( pageSize ) ) {
            this.props.updatePageSize( pageSize );
        } else {
            ReactDOM.findDOMNode( this.refs.pageSize ).value = pageSize.substring( 0, pageSize.length - 1 );
        }
    }
    
    handleDelete(survey) {
        this.props.onDelete( survey );
    }
    
    
    // end::handle-page-size-updates[]

    // tag::handle-nav[]
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
    
    
    // end::handle-nav[]
  
    alertMessage() {
        alert("hello!");
    }


    render() {
        
       
        
        var deleteClick = function(row) {
            console.log("deleteShouldGoHere");
        }
        var answerClick = function(row) {
            console.log("go Answer should go here");
        }
        
        var surveysCopy = this.props.surveys.map ( 
                function(s){ 
                    return  {key:s.entity._links.self.href,
                        name: s.entity.name,
                        description: s.entity.description,
                        helpText:s.entity.helpText,
                        entity: s.entity}
                    });
        var surveys = this.props.surveys.map( survey =>
            <Survey key={survey.entity._links.self.href}
                survey={survey}
                attributes={this.props.attributes}
                onUpdate={this.props.onUpdate}
                onDelete={this.props.onDelete}/>
            
        );
        
        function deleteFormatter(cell, row){
            return <button onClick={deleteClick(row)} className="btn btn-danger">Delete</button>
            ;
          }
        
        function answerFormatter(cell, row){
            return <a href="#AnswerSurvey">
            <button onClick={answerClick(row)} className="btn btn-success">Answer Survey</button>
            </a>
          }

        var navLinks = [];
        if ( "first" in this.props.links ) {
            navLinks.push( <button key="first" onClick={this.handleNavFirst}>&lt; &lt; </button> );
        }
        if ( "prev" in this.props.links ) {
            navLinks.push( <button key="prev" onClick={this.handleNavPrev}>&lt; </button> );
        }
        if ( "next" in this.props.links ) {
            navLinks.push( <button key="next" onClick={this.handleNavNext}>&gt; </button> );
        }
        if ( "last" in this.props.links ) {
            navLinks.push( <button key="last" onClick={this.handleNavLast}>&gt; &gt; </button> );
        }

        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                
              <BootstrapTable data={surveysCopy} striped={true} hover={true} condensed={true} >
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true} dataAlign="center">Name</TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataAlign="center">Description</TableHeaderColumn>
                <TableHeaderColumn dataField="helpText" dataAlign="center">Help Text</TableHeaderColumn>
                <TableHeaderColumn dataFormat={deleteFormatter}>Actions</TableHeaderColumn>
                <TableHeaderColumn dataFormat={answerFormatter}>Actions</TableHeaderColumn>
               
            </BootstrapTable>
            
           
                <div>
                    {navLinks}
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
                <td>{this.props.survey.entity.helpText}</td>
                <td>
                    <UpdateDialog survey={this.props.survey}
                        attributes={this.props.attributes}
                        onUpdate={this.props.onUpdate}/>
                </td>
                <td><button onClick={this.handleDelete} className="btn btn-danger">Delete</button></td>

                <td><a href="#AnswerSurvey"><button className="btn btn-success">Answer Survey</button></a></td>
            </tr>
        )
    }
}

class CreateDialog extends React.Component {

    constructor( props ) {
        super( props );
        this.handleSubmit = this.handleSubmit.bind( this );
    }

    handleSubmit( e ) {
        e.preventDefault();

        // Navigate away from the dialog to hide it.
        window.location = "#createSurvey";
    }

    render() {
        var inputs = this.props.attributes.map( attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );

        return (
            <div style={{padding:'10px'}}>
                <button className="btn btn-success" onClick={this.handleSubmit}> Create new survey</button>
            </div>
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
                                <strong>Question: </strong>Which is the best responsive framework to start web designing?

                            </div>
                            <div className="panel-body">
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="group-poll"/>
                                        <strong>A.</strong>Bootstrap Framework
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="group-poll"/>
                                        <strong>B.</strong>Foundation
                                    </label>
                                </div>
                                <div className="radio">
                                    <label>
                                        <input type="radio" name="group-poll"/>
                                        <strong>C.</strong>Kube Framework
                                    </label>
                                </div>
                                <hr />
                                <h5 className="text-danger">Result Of User Votes: </h5>
                                <hr />
                                Bootstrap ( 60% ):
                                <div className="progress progress-striped active">
                                    <div className="progress-bar progress-bar-danger"
                                        role="progressbar" aria-valuenow="60"
                                    				aria-valuemin="0" aria-valuemax="100" style={{ width: '60%' }}>
                                        <span className="sr-only">60% Complete ( success ) </span>
                                    </div>
                                </div>
                                Foundation ( 30% ):
                                <div className="progress progress-striped active">
                                    <div className="progress-bar progress-bar-warning"
                                        role="progressbar" aria-valuenow="30"
                                        aria-valuemin="0" aria-valuemax="100" style={{ width: '30%' }} >
                                        <span className="sr-only">30% Complete ( success ) </span>
                                    </div>
                                </div>
                                Kube ( 10% ):
                                <div className="progress progress-striped active">
                                    <div className="progress-bar progress-bar-success"
                                        role="progressbar" aria-valuenow="10"
                                        aria-valuemin="0" aria-valuemax="100"
                                        style={{ width: '10%' }} >
                                        <span className="sr-only">10% Complete ( success ) </span>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-footer">
                                <a href="#" className="btn btn-success btn-sm">
                                    <span className="glyphicon glyphicon-bell"></span> Mark Your Vote</a>
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
        this.handleHelpChange = this.handleHelpChange.bind(this);
        
        this.handleSurveyNameChange = this.handleSurveyNameChange.bind(this);
        this.handleSurveyDescriptionChange = this.handleSurveyDescriptionChange.bind(this);
        this.handleSurveyHelpChange = this.handleSurveyHelpChange.bind(this);
        this.handleMagic = this.handleMagic.bind(this);
    }
    
    
    handleMagic(e){
        alert("eeeeaaa");
     }
    
    
    handleNameChange(e){
        this.setState({questionName: e.target.value});
     }
    
    handleDescriptionChange(e){
        this.setState({questionDescription: e.target.value});
     }
    
    handleHelpChange(e){
        this.setState({questionHelp: e.target.value});
     }
    
    handleSurveyNameChange(e){
        this.setState({surveyName: e.target.value});
     }
    
    handleSurveyDescriptionChange(e){
        this.setState({surveyDescription: e.target.value});
     }
    
    handleSurveyHelpChange(e){
        this.setState({surveyHelp: e.target.value});
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
        this.state.newSurvey.helpText = this.state.surveyHelp;
        
        this.onCreate( this.state.newSurvey );


        // Navigate away from the dialog to hide it.
        window.location = "#";
    }
    
    createQuestion(e){
        e.preventDefault();
        
        var newQuestion = {};
        
        newQuestion.questionText = this.state.questionName;
        newQuestion.description = this.state.questionDescription;
        newQuestion.helpText = this.state.questionHelp;
        
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
                    
                    <div className="form-group">
                    <textarea form ="formi"
                        className="form-control"
                        cols="35"
                        wrap="soft"
                        name="surveyHelp" 
                            onChange={this.handleSurveyHelpChange}
                        placeholder="Help"></textarea>

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
                                    <textarea form ="formi"
                                        className="form-control"
                                        cols="35"
                                        wrap="soft"
                                        name="questionHelp"
                                            onChange={this.handleHelpChange}
                                        placeholder="HelpText"></textarea>
                                        
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
            <Route path="/AnswerSurvey" component={TestQuestion}/>
            <Route path="/createSurvey" component={CreateSurvey}/>
        </Router>
    ),
    document.getElementById( 'react' )
	)