package unq_surveys.helpers;

import java.util.ArrayList;
import java.util.List;

import unq_surveys.domain.Career;
import unq_surveys.domain.QuestionOption;
import unq_surveys.domain.RadioQuestion;
import unq_surveys.domain.Survey;
import unq_surveys.services.CareerService;
import unq_surveys.services.QuestionService;
import unq_surveys.services.SurveyService;

public class SurveysBuilder {

	public static void build(SurveyService repo, QuestionService questionService, CareerService careerService) {
		
				
		List<Survey> surveys = new ArrayList<Survey>();
		
		careerService.getAll().stream().forEach( career -> {
			surveys.add(SurveysBuilder.buildSurveyForCareer(career));
		});		
		saveSurveys(surveys, repo, questionService);
	}

	
	/**
	 * Saves all surveys from a list, as well as their questions
	 * @param surveys
	 * @param repo
	 * @param questionService
	 */
	private static void saveSurveys(List<Survey> surveys, SurveyService surveyService, QuestionService questionService) {
		
		surveys.stream().forEach(s -> {
			s.getQuestions().stream().forEach(q -> { questionService.save(q);});
			surveyService.save(s);
		});
	}



	public static Survey buildSurveyForCareer(Career aCareer) {
		Survey builtSurvey = new Survey(aCareer.getName());		
		aCareer.getSubjects().stream().forEach( subject -> {
			//consider the subject title as the question text
			RadioQuestion subjectQuestion = new RadioQuestion(subject.getName(),subject.isShared());
			subject.getCourses().stream().forEach( course -> {
				//Each new option will have as key an integer from 1 to n
				subjectQuestion.getOptions().add(new QuestionOption(subjectQuestion.getOptions().size() + 1, course.toString()));
			});			
			builtSurvey.getQuestions().add(subjectQuestion); 
			
		});
		return builtSurvey;
	}
}
