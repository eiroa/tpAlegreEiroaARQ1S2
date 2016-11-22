'use strict';

import React from 'react';
import ReactDOM from 'react-dom';


class TestQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.loadQuestion = this.loadQuestion.bind(this);
    }
    
    loadQuestion(){
        this.setState({question: JSON.parse(localStorage.getItem('questionSelected'))});
        }
    
    componentWillMount(){
        this.loadQuestion();
    }
    
    render() {
        
        var title = this.state.question.name;
        var options = Object.keys(this.state.question.options).map(key => this.state.question.options[key])
        var radioOptions = options.map(o  => {
            return <div className="radio">
            <label>
            <input type="radio" name="group-poll"/>
            <strong>{o}</strong>
        </label>
                    </div>
          });
        
        var results = options.map(o =>{
            return <div>{o}  
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
                                
                                
module.exports = TestQuestion;                                
                                