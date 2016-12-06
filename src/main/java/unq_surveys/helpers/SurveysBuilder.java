package unq_surveys.helpers;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.bson.types.ObjectId;

import unq_surveys.domain.Career;
import unq_surveys.domain.Question;
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
			// Now that the questions are saved, it is imperative to include de ids before saving the surveys
			s.getQuestions().stream().forEach(
					q -> 
					{ 	questionService.save(q); 
					String id = questionService.getQuestion(q.getQuestionText()).getId();
						System.out.println("setting id " + id);
						q.setId(id);
					});
			surveyService.save(s);
			System.out.println("          checking id questions in survey "+ s.getQuestions().toString() + "            ");
		});
		
		
	}



	public static Survey buildSurveyForCareer(Career aCareer) {
		Survey builtSurvey = new Survey(aCareer.getName());
		builtSurvey.setQuestions(new LinkedList<Question>());
		aCareer.getSubjects().stream().forEach( subject -> {
			//consider the subject title as the question text
			RadioQuestion subjectQuestion = new RadioQuestion(subject.getName(),subject.isShared());
			subjectQuestion.setOptions(new LinkedList<QuestionOption>());
			subject.getCourses().stream().forEach( course -> {
				//Each new option will have as key an integer from 1 to n
				subjectQuestion.getOptions().add(new QuestionOption(subjectQuestion.getOptions().size() + 1, course.toString()));
			});			
			builtSurvey.getQuestions().add(subjectQuestion); 
			
		});
		return builtSurvey;
	}
}
