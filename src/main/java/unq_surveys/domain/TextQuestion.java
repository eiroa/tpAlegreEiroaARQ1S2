package unq_surveys.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TextQuestion extends Question {

	@JsonCreator
	public TextQuestion(@JsonProperty("id") int id, 
			@JsonProperty("questionText") String questionText, 
			@JsonProperty("description") String description, 
			@JsonProperty("helpText") String helpText) {
		super(id,questionText,description,helpText);
		
	}
	
//	public TextQuestion(
//			@JsonProperty("questionText") String questionText, 
//			@JsonProperty("description") String description, 
//			@JsonProperty("helpText") String helpText) {
//		super(questionText,description,helpText);
//		this.setQuestionText(questionText);
//		this.setDescription(description);
//		this.setHelpText(helpText);
//	}
	
	public TextQuestion(){
		super();
	}
}
