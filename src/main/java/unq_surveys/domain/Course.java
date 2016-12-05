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
	
	Integer year;
	Integer semester;
	
	public Course(){
		
	}
	
	public Course(int quota) {
		assertQuotaIsGreaterThanZero(quota);
		this.quota = quota;
	}


	public Course(int quota, int year, int semester) {
		assertQuotaIsGreaterThanZero(quota);
		this.quota = quota;
		this.schedules = new ArrayList<Schedule>();
		this.year = year;
		this.semester = semester;
	}

	private void assertQuotaIsGreaterThanZero(int quota) {
		if(quota <= 0) { throw new RuntimeException("Course quota has to be greater than zero"); }
	}
	
	
	
	public int numberOfSchedules(){
		return schedules.size();
	}

	public void addSchedule(Schedule aSchedule){
		//Ignore adding a new one if identical schedule already exists
		
		if(!(schedules.stream().anyMatch( schedule -> schedule.dayOfWeek.compareTo(aSchedule.dayOfWeek) == 0  && 
				schedule.startTime == aSchedule.startTime && schedule.endTime == aSchedule.endTime))){
			
			schedules.add(aSchedule);
		}
		
	}

	public int getQuota() {
		return quota;
	}

	public List<Schedule> getSchedules() {
		return schedules;
	}

	@Override
	public String toString(){
		String res = "";
		for (Schedule schedule : schedules) {
			if(!res.isEmpty()){
				  res = res + " , ";
			}
			res = res + schedule.toString();  
		}
		return  res;
	}
}
