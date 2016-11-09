package unq_surveys.domain;

public class Course {
	
	static final int MINIMUM_START_TIME = 8;
	static final int MAXIMUM_END_TIME = 22;
	
	int startTime;
	int endTime;
	int quota; //Cupo
		
	public Course(int startTime, int endTime, int quota) {
		assertCourseParameters(startTime, endTime, quota);		
		this.startTime = startTime;
		this.endTime = endTime;
		this.quota = quota;
	}

	public int getStartTime() {
		return startTime;
	}

	public int getEndTime() {
		return endTime;
	}

	public int getQuota() {
		return quota;
	}	
	
	private void assertCourseParameters(int startTime, int endTime, int quota){
		assertQuota(quota);
		assertStartTime(startTime);
		assertEndTime(endTime);
		assertStartTimeIsLesserThanEndTime(startTime, endTime);
	}

	private void assertQuota(int quota) {
		if(quota < 0) { throw new RuntimeException("Course cannot have a negative quota"); }
	}

	private void assertStartTimeIsLesserThanEndTime(int startTime, int endTime) {
		if(startTime >= endTime) { throw new RuntimeException("Course startTime cannot be greater than or equal to endTime"); }
	}

	private void assertEndTime(int endTime) {
		if(endTime > MAXIMUM_END_TIME) { throw new RuntimeException("Course endTime cannot be greater than " + MAXIMUM_END_TIME); }
	}

	private void assertStartTime(int startTime) {
		if(startTime < MINIMUM_START_TIME) { throw new RuntimeException("Course startTime cannot be lesser than " + MINIMUM_START_TIME); }
	}
}
