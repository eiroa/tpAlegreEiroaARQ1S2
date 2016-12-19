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
	boolean isShared;
	
	private @Version @JsonIgnore Long version;
	
	public Subject(){
		
	}

	public Subject(String name,boolean isShared) {
		this.name = name;
		courses = new ArrayList<Course>();
		this.isShared = isShared;
	}

	public int numberOfCourses() {
		return courses.size();
	}

	public String getName() {
		return name;
	}
	
	public void addCourse(Course c){
		
		if(!this.courses.stream().anyMatch(course -> 
		course.year.equals(c.year) && 
		course.semester.equals(c.semester) && 
		course.getSchedules().toString().equals(c.getSchedules().toString()))){
			this.courses.add(c);
		}else{
			System.out.println(" ///////////   Warning, subject already has a course////////");
		}
		
	}

}
