package unq_surveys.domain;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection="questions")
public class TextQuestion extends Question {

	@JsonCreator
	public TextQuestion(@JsonProperty("id") ObjectId id, 
			@JsonProperty("questionText") String questionText, 
			@JsonProperty("description") String description,
			@JsonProperty("isShared") boolean shared) {
		super(id,questionText,description,shared);
		
	}
	
	public TextQuestion(){
		super();
	}
}
