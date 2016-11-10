package unq_surveys.domain;

import static org.junit.Assert.*;

import org.junit.Test;

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
