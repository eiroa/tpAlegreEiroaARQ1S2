package unq_surveys.domain;

import java.util.ArrayList;
import java.util.List;

public class Subject {

	String name;
	List<Course> courses;

	public Subject(String name) {
		this.name = name;
		courses = new ArrayList<Course>();
	}
	
	public String getName() {
		return name;
	}

	public List<Course> getCourses() {
		return courses;
	}


	public void addCourse(Course aCourse) {
		courses.add(aCourse);
	}

	public int numberOfCourses() {
		return courses.size();
	}		
}
