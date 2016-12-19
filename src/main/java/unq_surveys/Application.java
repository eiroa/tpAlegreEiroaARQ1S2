package unq_surveys;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import unq_surveys.helpers.CareersBuilder;
import unq_surveys.helpers.SurveysBuilder;
import unq_surveys.services.CareerService;
import unq_surveys.services.QuestionAnswerService;
import unq_surveys.services.QuestionService;
import unq_surveys.services.SubjectService;
import unq_surveys.services.SurveyService;
import unq_surveys.services.UserService;

/**
 * Clase maestra que define el punto de entrada de la aplicacion
 * 
 * El tag SpringBootApplication es el que permite definir por defecto varias configuraciones
 * 
 * la interfaz de commandLinerRunner implementa el metodo run que se ejecuta 
 * al momento de levantar la aplicacion
 * 
 * En este caso en particular se inyecta con autowired el SurveyService para usarlo en el run
 * 
 * @author eiroa
 *
 */
@SpringBootApplication
public class Application implements CommandLineRunner {

	@Autowired	
	private SurveyService surveyRepo;
	
	@Autowired	
	private CareerService careerRepo;
	
	@Autowired	
	private SubjectService subjectRepo;
	
	@Autowired
	private QuestionService questionRepo;
	
	@Autowired
	private QuestionAnswerService questionAnswerRepo;
	
	@Autowired
	private UserService userRepo;
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

	@Override
	public void run(String... args) throws Exception {
		
		//Erase everything at the beginning and create initial data,  
		//TODO: this should be removed sooner or later
		
		surveyRepo.deleteAll();
		subjectRepo.deleteAll();
		careerRepo.deleteAll();
		questionAnswerRepo.deleteAll();
		questionRepo.deleteAll();
		userRepo.deleteAll();
		
		CareersBuilder.build(careerRepo,subjectRepo);
		SurveysBuilder.build(surveyRepo,questionRepo, careerRepo,userRepo);
		
		
	}
}
