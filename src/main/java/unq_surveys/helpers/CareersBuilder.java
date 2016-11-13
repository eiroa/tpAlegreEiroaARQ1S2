package unq_surveys.helpers;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;

import unq_surveys.domain.Career;
import unq_surveys.domain.Course;
import unq_surveys.domain.Schedule;
import unq_surveys.domain.Subject;
import unq_surveys.services.CareerService;
import unq_surveys.services.SubjectService;

public class CareersBuilder {

	public static void build(CareerService careerService, SubjectService subjectService) {
		Career tpi = new Career("Tecnicatura Universitaria en Programacion Informatica");
		
		Subject intro = new Subject("Introduccion a la Programacion");
		Subject mate1 = new Subject("Matematica 1");
		Subject orga = new Subject("Organizacion y Arquitectura");
		Subject obj1 = new Subject("Programacion con Objetos 1");
		Subject obj2 = new Subject("Programacion con Objetos 2");
		Subject uis = new Subject("Construccion de UIs");
		Subject obj3 = new Subject("Programacion con Objetos 3");
		Subject desapp = new Subject("Desarrollo de Aplicaciones");
		
		List<Subject> tpiSubjects = Arrays.asList(intro,mate1,orga,obj1,obj2,uis,obj3,desapp);
		addSubjectsToCareer(tpi, tpiSubjects);
		buildCoursesForSubjects(tpiSubjects);
		saveSubjects(tpiSubjects, subjectService);
		careerService.save(tpi);
		
		Career li = new Career("Licenciatura en Informatica");
		
		Subject gest = new Subject("Gestion de Proyectos de Software");
		Subject prac = new Subject("Practicas de Desarrollo de Software");
		Subject lyp = new Subject("Logica y Programacion");
		Subject arq1 = new Subject("Arquitectura de Software 1");
		
		List<Subject> liSubjects = Arrays.asList(intro,mate1,orga,obj1,obj2,uis,obj3,gest,prac,lyp,arq1);
		addSubjectsToCareer(li, liSubjects);
		buildCoursesForSubjects(liSubjects);
		
		saveSubjects(liSubjects, subjectService);
		careerService.save(li);
	}

	private static void addSubjectsToCareer(Career career, List<Subject> subjects) {
		subjects.stream().forEach( subject -> { career.addSubject(subject); });
	}

	private static void buildCoursesForSubjects(List<Subject> subjects) {
		subjects.stream().forEach( subject -> {
			addCourseToSubject(subject, 20, new Schedule(DayOfWeek.MONDAY, 9, 12), new Schedule(DayOfWeek.TUESDAY, 9, 12));
			addCourseToSubject(subject, 20, new Schedule(DayOfWeek.THURSDAY, 19, 22), new Schedule(DayOfWeek.FRIDAY, 19, 22));			
			}
		);
	}

	private static void addCourseToSubject(Subject subject, int quota, Schedule firstSchedule, Schedule secondSchedule) {
		Course course = new Course(quota);
		course.addSchedule(firstSchedule);
		course.addSchedule(secondSchedule);
		subject.addCourse(course);
	}
	
	private static void saveSubjects(List<Subject> subjects, SubjectService repo) {
		
		subjects.stream().forEach(subject -> {
			repo.save(subject);
		});
	}
}
