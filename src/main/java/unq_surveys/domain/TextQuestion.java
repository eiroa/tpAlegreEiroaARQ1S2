package unq_surveys.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TextQuestion extends Question {

	@JsonCreator
	public TextQuestion(@JsonProperty("id") String id, 
			@JsonProperty("questionText") String questionText, 
			@JsonProperty("description") String description,
			@JsonProperty("isShared") boolean shared) {
		super(id,questionText,description,shared);
		
	}
	
	public TextQuestion(){
		super();
	}
}
