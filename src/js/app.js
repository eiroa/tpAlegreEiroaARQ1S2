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
		this.loadFromServer(this.state.pageSize);
	}
	
	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'surveys', params: {size: pageSize}}]
		).then(surveyCollection => {
			return client({
				method: 'GET',
				path: surveyCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return surveyCollection;
			});
		}).done(surveyCollection => {
			this.setState({
				surveys: surveyCollection.entity._embedded.surveys,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: surveyCollection.entity._links});
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

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newSurvey= {};
		this.props.attributes.forEach(attribute => {
			newSurvey[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newSurvey);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
		);

		return (
			<div>
				<a href="#createSurvey">Create</a>

				<div id="createSurvey" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new Survey</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}

ReactDOM.render(
		<App />,
		document.getElementById('react')
	)