'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SkyLight from 'react-skylight';

const client = require( './client' );
const root = '/api';
const follow = require( './follow' )

class CreateCareer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                showCreateQuestionDialog: false,
                newSurvey: {}
              };
        this.onCreate = this.onCreate.bind(this);
        this.createCareer = this.createCareer.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        
        this.handleSurveyNameChange = this.handleSurveyNameChange.bind(this);
        this.handleSurveyDescriptionChange = this.handleSurveyDescriptionChange.bind(this);
    }
    
    
    
    
    handleNameChange(e){
        this.setState({name: e.target.value});
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
        follow( client, root, ['careers'] ).then( surveyCollection => {
            return client( {
                method: 'POST',
                path: surveyCollection.entity._links.self.href,
                entity: newSurvey,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then( response => {
            return follow( client, root, [
                { rel: 'careers', params: { 'size': 2} }] );
        });
    }
    
    createCareer(e){
        e.preventDefault();
        
        
        this.state.newSurvey.name = this.state.name;
        
        this.onCreate( this.state.newSurvey );


        // Navigate away from the dialog to hide it.
        window.location = "#careers";
    }
    
    
    render() {
        
        
        return (
            <div   className="panel panel-primary" id="panelNewIdea">
                <div className="panel-heading"><h3>Crear nueva carrera</h3></div>

                <div className="panel-body" id="formi" style={{ marginTop: '30px' }}>


                    <div className="form-group">
                        <input type="text"
                            className="form-control"
                            placeholder="Nombre de carrera"
                            name="name"
                                onChange={this.handleNameChange}
                                required></input>
                    </div>
                    <button onClick={this.createCareer} className='btn btn-success'> Guardar</button>
                </div>
            </div>
        )
    }
}


module.exports = CreateCareer;