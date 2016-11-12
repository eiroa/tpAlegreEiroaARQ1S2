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
public class Subject {
	
	@Id 
	private String id;

	String name;
	List<Course> courses;
	
	private @Version @JsonIgnore Long version;

	public Subject(String name) {
		this.name = name;
		courses = new ArrayList<Course>();
	}


	public void addCourse(Course aCourse) {
		courses.add(aCourse);
	}

	public int numberOfCourses() {
		return courses.size();
	}		
}
