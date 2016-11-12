package main.java.unq_surveys.domain;



import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import unq_surveys.domain.Career;
import unq_surveys.domain.Subject;

public class CareerTest {

	@Test
	public void testCareerIsCreatedProperly() {
		Career career = new Career("University Technician in Computer Systems Programming");
		assertEquals("University Technician in Computer Systems Programming", career.getName());
		assertTrue(career.getSubjects().isEmpty());
	}
	@Test
	public void testCareerCanAddSubjects() {
		Career career = new Career("University Technician in Computer Systems Programming");
		Subject aSubject = new Subject("Programming 101");
		career.addSubject(aSubject);
		assertEquals(1, career.numberOfSubjects());
	}

}
