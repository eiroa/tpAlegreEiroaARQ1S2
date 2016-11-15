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
public class User {

	@Id 
	private String id;
	
	String name;	
	
	private @Version @JsonIgnore Long version;
	
	public User(String name) {
		this.name = name;
	}
	
	public User() {
	}

	
}
