package unq_surveys.domain;

import static org.junit.Assert.*;

import java.time.DayOfWeek;

import org.junit.Test;

public class CourseTest {

	@Test
	public void testCourseIsCreatedProperly() {
		Course course = new Course(20);
		assertEquals(20,course.getQuota());
		assertTrue(course.getSchedules().isEmpty());
	}
	
	@Test
	public void testCourseCanAddSchedules() {
		Course course = new Course(20);
		course.addSchedule(new Schedule(DayOfWeek.MONDAY,10,14));
		assertEquals(1,course.numberOfSchedules());
	}

	@Test
	public void testCannotCreateCourseWithAQuotaOfZeroOrLess() {
		try {
			new Course(0);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course quota has to be greater than zero", e.getMessage());
		}
	}
}
