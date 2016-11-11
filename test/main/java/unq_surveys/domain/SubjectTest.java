package main.java.unq_surveys.domain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import unq_surveys.domain.Course;
import unq_surveys.domain.Subject;

public class SubjectTest {

	@Test
	public void testSubjectIsCreatedProperly() {		
		Subject subject = new Subject("Programming 101");
		assertTrue(subject.getCourses().isEmpty());
	}
	@Test
	public void testSubjectCanAddCourses() {		
		Subject subject = new Subject("Programming 101");
		Course aCourse = new Course(20);
		subject.addCourse(aCourse);
		assertEquals(1, subject.numberOfCourses());
	}

}
