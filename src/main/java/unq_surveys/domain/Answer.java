package unq_surveys.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Document
@Data
public class Answer {

	@Id 
	private String id;
	
	private @Version @JsonIgnore Long version;
	
	private boolean started;
	private boolean answered;
	private boolean edited;
	
	public Answer(){
		
	}

	
}
