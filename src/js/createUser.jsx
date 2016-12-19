'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SkyLight from 'react-skylight';

const client = require( './client' );
const root = '/api';
const follow = require( './follow' )

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                showCreateQuestionDialog: false,
                newSurvey: {}
              };
        this.handleClickCreateQuestion = this.handleClickCreateQuestion.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.createUser = this.createUser.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStudentIdChange = this.handleStudentIdChange.bind(this);
        this.handleSurnameChange = this.handleSurnameChange.bind(this);
        this.handleMailChange = this.handleMailChange.bind(this);
    }
    
    
    
    
    handleNameChange(e){
        this.setState({name: e.target.value});
     }
    
    handleStudentIdChange(e){
        this.setState({studentId: e.target.value});
     }
    
    handleMailChange(e){
        this.setState({mail: e.target.value});
     }
    
    
    handleSurnameChange(e){
        this.setState({surname: e.target.value});
     }
    
    
    
    onCreate( newSurvey ) {
        follow( client, root, ['users'] ).then( surveyCollection => {
            return client( {
                method: 'POST',
                path: surveyCollection.entity._links.self.href,
                entity: newSurvey,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then( response => {
            return follow( client, root, [
                { rel: 'users', params: { 'size': 2} }] );
        });
    }
    
    createUser(e){
        e.preventDefault();
        
        
        this.state.newSurvey.name = this.state.name;
        this.state.newSurvey.surname = this.state.surname;
        this.state.newSurvey.studentId = this.state.studentId;
        this.state.newSurvey.mail = this.state.mail;
        
        this.onCreate( this.state.newSurvey );


        // Navigate away from the dialog to hide it.
        window.location = "#users";
    }
    
    
    handleClickCreateQuestion() {
        this.setState({
            showCreateQuestionDialog: true
        });
      }
    
    render() {
        
    
        return (
            <div   className="panel panel-primary" id="panelNewIdea">
                <div className="panel-heading"><h3>Crear nuevo usuario</h3></div>

                <div className="panel-body" id="formi" style={{ marginTop: '30px' }}>


                    <div className="form-group">
                        <input type="text"
                            className="form-control"
                            placeholder="Nombres"
                            name="name"
                                onChange={this.handleNameChange}
                                required></input>
                    </div>
                    <div className="form-group">
                    <input type="text"
                        className="form-control"
                        placeholder="Apellidos"
                        name="surname"
                            onChange={this.handleSurnameChange}
                            required></input>
                </div>
                <div className="form-group">
                <input type="text"
                    className="form-control"
                    placeholder="Legajo"
                    name="studentId"
                        onChange={this.handleStudentIdChange}
                        required></input>
            </div>
            <div className="form-group">
            <input type="text"
                className="form-control"
                placeholder="Mail"
                name="mail"
                    onChange={this.handleMailChange}
                    required></input>
        </div>
                    

                    <button onClick={this.createUser} className='btn btn-success'> Guardar</button>
                </div>
            </div>
        )
    }
}


module.exports = CreateUser;