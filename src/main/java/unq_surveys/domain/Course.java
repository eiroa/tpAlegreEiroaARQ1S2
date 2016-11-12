package unq_surveys.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
public class Course {

	
	int quota; //Cupo
	List<Schedule> schedules;

	public Course(int quota) {
		assertQuotaIsGreaterThanZero(quota);
		this.quota = quota;
		this.schedules = new ArrayList<Schedule>();
	}

	private void assertQuotaIsGreaterThanZero(int quota) {
		if(quota <= 0) { throw new RuntimeException("Course quota has to be greater than zero"); }
	}
	
	public int numberOfSchedules(){
		return schedules.size();
	}

	public void addSchedule(Schedule aSchedule){
		schedules.add(aSchedule);
	}
	
}
