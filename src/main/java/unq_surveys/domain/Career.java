package unq_surveys.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class Career {

	String name;	
	List<Subject> subjects;
	//TODO add List<Student> students field for Career model.
	
	public Career(String name) {
		this.name = name;
		this.subjects = new ArrayList<Subject>();
	}

	public String getName() {
		return name;
	}

	public List<Subject> getSubjects() {
		return subjects;
	}

	public void addSubject(Subject aSubject) {
		subjects.add(aSubject);		
	}

	public int numberOfSubjects() {
		return subjects.size();
	}

}
