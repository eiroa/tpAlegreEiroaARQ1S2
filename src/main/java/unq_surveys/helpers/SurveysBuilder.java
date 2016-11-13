package unq_surveys.helpers;

import java.util.ArrayList;
import java.util.List;

import unq_surveys.domain.Career;
import unq_surveys.domain.Question;
import unq_surveys.domain.RadioQuestion;
import unq_surveys.domain.Survey;
import unq_surveys.domain.TextQuestion;
import unq_surveys.services.CareerService;
import unq_surveys.services.SurveyService;

public class SurveysBuilder {

	public static void build(SurveyService repo, CareerService careerService) {
		
				
		List<Survey> surveys = new ArrayList<Survey>();
		
		careerService.getAll().stream().forEach( career -> {
			surveys.add(SurveysBuilder.buildSurveyForCareer(career));
		});		
		saveSurveys(surveys, repo);
	}

	
	
	private static void saveSurveys(List<Survey> surveys, SurveyService repo) {
		
		surveys.stream().forEach(s -> {
			repo.save(s);
		});
	}



	public static Survey buildSurveyForCareer(Career aCareer) {
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
