package unq_surveys.helpers;

import java.util.ArrayList;
import java.util.List;

import unq_surveys.domain.Career;
import unq_surveys.domain.Question;
import unq_surveys.domain.RadioQuestion;
import unq_surveys.domain.Survey;
import unq_surveys.domain.TextQuestion;
import unq_surveys.services.SurveyService;

public class SurveysBuilder {

	public static void build(SurveyService repo) {
		
		
		List<Question> qs1 = new ArrayList<Question>();
		List<Question> qs2 = new ArrayList<Question>();
		List<Question> qs3 = new ArrayList<Question>();
		
		Question q1 = new TextQuestion(1,"q1","qd1","help!!!");
		Question q2 = new TextQuestion(2,"q2","qd2","help!!!");
		
		
		Question q3 = new TextQuestion(3,"q3","qd3","help!!!");
		Question q4 = new TextQuestion(4,"q4","qd4","help!!!");
		
		Question q5 = new TextQuestion(5,"q5","qd5","help!!!");
		Question q6 = new TextQuestion(6,"q6","qd6","help!!!");
		
		qs1.add(q1);
		qs1.add(q2);
		qs2.add(q3);
		qs2.add(q4);
		qs3.add(q5);
		qs3.add(q6);
		
		
		Survey s1 = new Survey( "Encuesta 1q 2016 LDS",
				"Encuesta de inscripción LDS 1 cuatrimestre 2016",
				"Completar todas las respuestas",
				qs1);
		
		Survey s2 = new Survey("Encuesta 2q 2016 LDS",
				"Encuesta de inscripción LDS 2 cuatrimestre 2016",
				"Completar todas las respuestas",
				qs2);
		
		Survey s3 = new Survey("Encuesta 1q 2016 TPI",
				"Encuesta de inscripción TPI 1 cuatrimestre 2016",
				"Completar todas las respuestas",
				qs3);
		
		List<Survey> surveys = new ArrayList<Survey>();
		
		surveys.add(s1);
		surveys.add(s2);
		surveys.add(s3);
		
		saveSurveys(surveys, repo);
	}

	
	
	private static void saveSurveys(List<Survey> surveys, SurveyService repo) {
		
		surveys.stream().forEach(s -> {
			repo.save(s);
		});
	}



	public Survey buildSurveyForCareer(Career aCareer) {
		Survey builtSurvey = new Survey(aCareer.getName());		
		aCareer.getSubjects().stream().forEach( subject -> {
			RadioQuestion subjectQuestion = new RadioQuestion(subject.getName());
			subject.getCourses().stream().forEach( course -> {
				subjectQuestion.getOptions().put(course.hashCode(), course.toString());
			});			
			builtSurvey.getQuestions().add(subjectQuestion); 
		});
		return builtSurvey;
	}
}
