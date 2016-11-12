package main.java.unq_surveys.domain;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.time.DayOfWeek;

import org.junit.Test;

import unq_surveys.domain.Schedule;

public class ScheduleTest {

	@Test
	public void testScheduleIsCreatedProperly() {
		Schedule Schedule = new Schedule(DayOfWeek.MONDAY, 16, 20);
		assertEquals(16, Schedule.getStartTime());
		assertEquals(20, Schedule.getEndTime());
		assertEquals(DayOfWeek.MONDAY, Schedule.getDayOfWeek());
	}

	@Test
	public void testCannotCreateScheduleWithStartTimeGreaterThanEndTime() {
		try {
			new Schedule(DayOfWeek.MONDAY, 21, 20);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Schedule startTime cannot be greater than or equal to endTime", e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateScheduleWithStartTimeEqualToEndTime() {
		try {
			new Schedule(DayOfWeek.MONDAY, 20, 20);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Schedule startTime cannot be greater than or equal to endTime", e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateScheduleWithStartTimeLesserThanMinimumStartTime() {
		try {
			new Schedule(DayOfWeek.MONDAY, Schedule.MINIMUM_START_TIME - 1, 20);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Schedule startTime cannot be lesser than " + Schedule.MINIMUM_START_TIME, e.getMessage());
		}
	}
	
	@Test
	public void testCannotCreateScheduleWithEndTimeGreaterThan22() {
		try {
			new Schedule(DayOfWeek.MONDAY, 20, Schedule.MAXIMUM_END_TIME + 1);
			fail();
		} catch (RuntimeException e) {
			assertEquals("Schedule endTime cannot be greater than " + Schedule.MAXIMUM_END_TIME, e.getMessage());
		}
	}
}
