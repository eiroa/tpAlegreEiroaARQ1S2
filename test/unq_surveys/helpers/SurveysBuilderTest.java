package unq_surveys.helpers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import unq_surveys.domain.Career;
import unq_surveys.domain.Course;
import unq_surveys.domain.Question;
import unq_surveys.domain.RadioQuestion;
import unq_surveys.domain.Subject;
import unq_surveys.domain.Survey;

public class SurveysBuilderTest {

	private Career aCareer = new Career("Test Career");
	private Subject subject1 = new Subject("Subject 1",false);
	private Subject subject2 = new Subject("Subject 2",false);
	private Subject subject3 = new Subject("Subject 3",false);
	private List<Subject> careerSubjects = Arrays.asList(subject1,subject2,subject3);
	
	@Before
	public void setUp() {
		careerSubjects.stream().forEach( subject -> { aCareer.addSubject(subject); });
		subject1.addCourse(new Course(20));
		subject1.addCourse(new Course(30));
		subject2.addCourse(new Course(10));
		subject3.addCourse(new Course(25));
		subject3.addCourse(new Course(26));
		subject3.addCourse(new Course(27));
	}	
	
	@Test
	public void testBuiltSurveyNameIsCareerName() {		
		Survey builtSurvey = SurveysBuilder.buildSurveyForCareer(aCareer);
		assertEquals("Test Career", builtSurvey.getName());
	}	
	
	@Test
	public void testBuiltSurveyHasAQuestionPerEachSubject() {
		Survey builtSurvey = SurveysBuilder.buildSurveyForCareer(aCareer);
		assertEquals(careerSubjects.size(), builtSurvey.getQuestions().size());
	}
	
	@Test
	public void testBuiltSurveyQuestionsTextsAreTheirSubjectsNames() {
		Survey builtSurvey = SurveysBuilder.buildSurveyForCareer(aCareer);
		List<Question> surveyQuestions = builtSurvey.getQuestions();
		assertTrue(surveyQuestions.stream().anyMatch(question -> question.getQuestionText().equals("Subject 1")));
		assertTrue(surveyQuestions.stream().anyMatch(question -> question.getQuestionText().equals("Subject 2")));
		assertTrue(surveyQuestions.stream().anyMatch(question -> question.getQuestionText().equals("Subject 3")));
	}
	
	@Test
	public void testBuiltSurveyQuestionsHaveAnOptionPerEachBelongingSubjectCourse() {
		Survey builtSurvey = SurveysBuilder.buildSurveyForCareer(aCareer);
		List<Question> surveyQuestions = builtSurvey.getQuestions();
		RadioQuestion subject1Question = (RadioQuestion) surveyQuestions.stream().filter(question -> question.getQuestionText().equals("Subject 1")).findFirst().get();
		assertEquals(subject1.numberOfCourses(),subject1Question.getOptions().size());
		RadioQuestion subject2Question = (RadioQuestion) surveyQuestions.stream().filter(question -> question.getQuestionText().equals("Subject 2")).findFirst().get();
		assertEquals(subject2.numberOfCourses(),subject2Question.getOptions().size());
		RadioQuestion subject3Question = (RadioQuestion) surveyQuestions.stream().filter(question -> question.getQuestionText().equals("Subject 3")).findFirst().get();
		assertEquals(subject3.numberOfCourses(),subject3Question.getOptions().size());
	}
}
