package unq_surveys.domain;


public class TextQuestion extends Question {

	public TextQuestion(String questionText, String description, String helpText) {
		super();
		this.setQuestionText(questionText);
		this.setDescription(description);
		this.setHelpText(helpText);
	}
}
