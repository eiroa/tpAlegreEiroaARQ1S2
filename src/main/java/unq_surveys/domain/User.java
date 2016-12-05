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
	
	private String name;
	private String surname;
	private int studentId;
	private String mail;
	
	
	private @Version @JsonIgnore Long version;
	
	public User(String name) {
		this.name = name;
	}
	
	public User() {
	}
	
	public User(String name, String surname, int studentId, String mail){
		this.name = name;
		this.surname =surname;
		this.studentId=studentId;
		this.mail=mail;
		
	}

	
}
