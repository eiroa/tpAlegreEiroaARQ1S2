package unq_surveys.domain;

import static org.junit.Assert.*;

import org.junit.Test;

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
