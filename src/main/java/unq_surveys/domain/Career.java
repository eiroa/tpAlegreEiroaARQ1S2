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
public class Career {

	@Id 
	private String id;
	
	String name;	
	
	
	List<Subject> subjects;
	//TODO add List<Student> students field for Career model.
	
	private @Version @JsonIgnore Long version;
	
	public Career(String name) {
		this.name = name;
		this.subjects = new ArrayList<Subject>();
	}

	public void addSubject(Subject aSubject) {
		subjects.add(aSubject);		
	}

	public int numberOfSubjects() {
		return subjects.size();
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public List<Subject> getSubjects() {
		return subjects;
	}
	
}
