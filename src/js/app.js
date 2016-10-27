'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const root = '/api'; 
const follow = require('./follow');// function to hop multiple links by "rel"



class App extends React.Component {// creamos un componente de REACT

	constructor(props) {
		super(props);
		this.state = {surveys: [], attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}
	
	loadFromServer(pageSize){
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
		}).then(surveyCollection => {
			this.setState({
				surveys: surveyCollection.entity._embedded.surveys,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: surveyCollection.entity._links});
		});
	}
	
	onCreate(newSurvey) {
		follow(client, root, ['surveys']).then(surveyCollection => {
			return client({
				method: 'POST',
				path: surveyCollection.entity._links.self.href,
				entity: newSurvey,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'surveys', params: {'size': this.state.pageSize}}]);
		}).then(response => {
			this.onNavigate(response.entity._links.self.href);
		});
	}
	
	onDelete(survey) {
		client({method: 'DELETE', path: survey._links.self.href}).then(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).then(surveyCollection => {
			this.setState({
				surveys: surveyCollection.entity._embedded.surveys,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: surveyCollection.entity._links
			});
		});
	}

	componentDidMount() { // que hacer al momento de haber cargado el componente,  se relaciona con el ciclo de vida del objeto DOM
		this.loadFromServer(this.state.pageSize);
	}
	
	

	render() { 
		return (
				<div>
					<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
					<SurveyList surveys={this.state.surveys}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
								  onDelete={this.onDelete}
								  updatePageSize={this.updatePageSize}/>
				</div>
			)
	}
}



class SurveyList extends React.Component{ // definimos la estructura de una lista de encuestas
	
	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	// tag::handle-page-size-updates[]
	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	// end::handle-page-size-updates[]

	// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	// end::handle-nav[]
	
	render() {
		var surveys = this.props.surveys.map(survey =>
			<Survey key={survey._links.self.href} survey={survey} onDelete={this.props.onDelete}/>
		);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Description</th>
							<th>Actions</th>
							<th></th>
						</tr>
						{surveys}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}



class Survey extends React.Component{
	
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.survey);
	}
	
	render() {
		return (
			<tr>
				<td>{this.props.survey.name}</td>
				<td>{this.props.survey.description}</td>
				<td>{this.props.survey.helpText}</td>
				<td><button onClick={this.handleDelete} className="btn btn-danger">Delete</button></td>
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