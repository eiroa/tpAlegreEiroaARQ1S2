'use strict';

import React from 'react';
import ReactDOM from 'react-dom';


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
                                
                                
module.exports = TestQuestion;                                
                                