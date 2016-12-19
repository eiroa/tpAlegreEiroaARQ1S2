'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SkyLight from 'react-skylight';

const client = require( './client' );
const root = '/api';
const follow = require( './follow' )

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
        
        
    
        return (
            <div   className="panel panel-primary" id="panelNewIdea">
                <div className="panel-heading"><h3>Crear nueva encuesta</h3></div>

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
                    name="career"
                    disabled   
                        placeholder="Seleccionar Carrera"></textarea>

            </div>
            
            <div className="form-group">
            <textarea form ="formi"
                className="form-control"
                cols="35"
                wrap="soft"
                name="subjects"
                disabled
                    placeholder="Seleccionar Materias"></textarea>

        </div>
                    

                    <button onClick={this.createSurvey} className='btn btn-success'> Guardar </button>
                </div>
            </div>
        )
    }
}


module.exports = CreateSurvey;