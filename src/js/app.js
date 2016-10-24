'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const root = '/api'; 



class App extends React.Component {// creamos un componente de REACT

	constructor(props) {
		super(props);
		this.state = {surveys: []};
	}

	componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
		client({method: 'GET', path: root+'/surveys'}).then(response => {
			this.setState({surveys: response.entity._embedded.surveys});
		});
	}

	render() { 
		return (
		  <SurveyList surveys={this.state.surveys}/>		
		)
	}
}



class SurveyList extends React.Component{ // definimos la estructura de una lista de encuestas
	render() {
		// utilizando la funcion map, mapeamos cada elemento encuesta de la lista con el template que definimos luego 
		var surveys = this.props.surveys.map(survey =>
			<Survey key={survey._links.self.href} survey={survey}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Help Text</th>
					</tr>
					{surveys}
				</tbody>
			</table>
		)
	}
}



class Survey extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.survey.name}</td>
				<td>{this.props.survey.description}</td>
				<td>{this.props.survey.helpText}</td>
			</tr>
		)
	}
}

ReactDOM.render(
		<App />,
		document.getElementById('react')
	)