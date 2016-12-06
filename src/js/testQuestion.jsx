'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const client = require( './client' );
const root = '/api';
const follow = require( './follow' )


class TestQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                newAnswer: {selectedOptions:[]}
              };
        this.loadQuestion = this.loadQuestion.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.checkOption = this.checkOption.bind(this);
        this.onSave = this.onSave.bind(this);
    }
    
    loadQuestion(){
        this.setState({question: JSON.parse(localStorage.getItem('questionSelected'))});
        }
    
    componentWillMount(){
        this.loadQuestion();
    }
    
    saveAnswer( newAnswer ) {
        follow( client, root, ['questionAnswers'] ).then( qaCollection => {
            return client( {
                method: 'POST',
                path: qaCollection.entity._links.self.href,
                entity: newAnswer,
                headers: { 'Content-Type': 'application/json' }
            })
        })
    }
    
    onSave(e){
        e.preventDefault();
        this.state.question.options.forEach(o => {
            if(o.checked){
                console.log("pushing "+o.key);
                this.state.newAnswer.selectedOptions = [o.key];
            }
        });
        this.state.newAnswer.question = this.state.question._links.self.href
        this.saveAnswer( this.state.newAnswer );

    }
    
    checkOption(key){
        console.log("key: "+key)
        this.state.question.options.forEach(o => {o.checked = false});
        this.state.question.options.forEach(o => {if (o.key == key){o.checked=true;}});
        console.log("test");
    }
    
    render() {
        
        var title = this.state.question.name;
        var options = Object.keys(this.state.question.options).map(key => this.state.question.options[key])
        var radioOptions = this.state.question.options.map(o  => {
            return <div className="radio">
            <label>
            <input onClick={() => this.checkOption(o.key)} type="radio" name="group-poll"/>
            <strong>{o.text}</strong>
        </label>
                    </div>
          });
        
        var results = this.state.question.options.map(o =>{
            return <div>{o.text}  
                <div className="progress progress-striped active">
                    <div className="progress-bar progress-bar-danger"
                        role="progressbar" aria-valuenow="60"
                                    aria-valuemin="0" aria-valuemax="100" style={{ width: (Math.random()*100).toString().concat('%')}}>
                    </div>
                </div>
            </div>
        });
        
        
        
        return (
            <div className="row">
                <div className="container-fluid">
                    <div className="user-poll-section">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <strong>Question: </strong>{title}

                            </div>
                            <div className="panel-body">
                                {radioOptions}
                                
                                <hr />
                                <h5 className="text-danger">Result Of User Votes: </h5>
                                <hr />
                                
                                
                                {results}
                                
                                
                                
                            </div>
                            <div className="panel-footer">
                                <button className="btn btn-success btn-sm" onClick={this.onSave}>
                                    <span className="glyphicon glyphicon-bell"></span> Save answer</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        )
    }


}


var Checkbox = React.createClass({
  onChange() {
    this.props.onChange(!this.props.checked);
  },

  render() {
    const props = {
      onChange: this.onChange,
    };

    return <input type="checkbox" />;
  }
});
                                
                                
module.exports = TestQuestion;                                
                                