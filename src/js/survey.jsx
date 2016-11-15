'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class Survey extends React.Component {

    constructor( props ) {
        super( props );
        this.handleDelete = this.handleDelete.bind( this );
    }

    handleDelete() {
        this.props.onDelete( this.props.survey );
    }

    handleAnswer() {
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

module.exports = Survey;
