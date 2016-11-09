package unq_surveys.domain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.Test;

public class CourseTest {

	@Test
	public void testCourseIsCreatedProperly() {
		Course course = new Course(16, 20, 30);
		assertEquals(16, course.getStartTime());
		assertEquals(20, course.getEndTime());
		assertEquals(30, course.getQuota());
	}

	@Test
	public void testCannotCreateCourseWithStartTimeGreaterThanEndTime() {
		try {
			new Course(21, 20, 30);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course startTime cannot be greater than or equal to endTime", e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateCourseWithStartTimeEqualToEndTime() {
		try {
			new Course(20, 20, 30);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course startTime cannot be greater than or equal to endTime", e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateCourseWithStartTimeLesserThanMinimumStartTime() {
		try {
			new Course(Course.MINIMUM_START_TIME - 1, 20, 30);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course startTime cannot be lesser than " + Course.MINIMUM_START_TIME, e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateCourseWithEndTimeGreaterThan22() {
		try {
			new Course(20, Course.MAXIMUM_END_TIME + 1, 30);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course endTime cannot be greater than " + Course.MAXIMUM_END_TIME, e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateCourseWithNegativeQuota() {
		try {
			new Course(20, 22, -5);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Course cannot have a negative quota", e.getMessage());
		}
	}
}
