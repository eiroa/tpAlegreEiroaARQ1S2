package unq_surveys.domain;

import java.time.DayOfWeek;

public class Schedule {
	
	static final int MINIMUM_START_TIME = 8;
	static final int MAXIMUM_END_TIME = 22;
	
	int startTime;
	int endTime;
	DayOfWeek dayOfWeek; //Cupo
		
	public Schedule(DayOfWeek dayOfWeek, int startTime, int endTime) {
		assertScheduleParameters(startTime, endTime, dayOfWeek);		
		this.startTime = startTime;
		this.endTime = endTime;
		this.dayOfWeek = dayOfWeek;
	}

	public int getStartTime() {
		return startTime;
	}

	public int getEndTime() {
		return endTime;
	}

	public DayOfWeek getDayOfWeek() {
		return dayOfWeek;
	}	
	
	private void assertScheduleParameters(int startTime, int endTime, DayOfWeek dayOfWeek){
		assertStartTime(startTime);
		assertEndTime(endTime);
		assertStartTimeIsLesserThanEndTime(startTime, endTime);
	}

	private void assertStartTimeIsLesserThanEndTime(int startTime, int endTime) {
		if(startTime >= endTime) { throw new RuntimeException("Schedule startTime cannot be greater than or equal to endTime"); }
	}

	private void assertEndTime(int endTime) {
		if(endTime > MAXIMUM_END_TIME) { throw new RuntimeException("Schedule endTime cannot be greater than " + MAXIMUM_END_TIME); }
	}

	private void assertStartTime(int startTime) {
		if(startTime < MINIMUM_START_TIME) { throw new RuntimeException("Schedule startTime cannot be lesser than " + MINIMUM_START_TIME); }
	}
}
