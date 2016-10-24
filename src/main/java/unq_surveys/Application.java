package unq_surveys;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import unq_surveys.domain.Survey;
import unq_surveys.services.SurveyService;

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
	private SurveyService repository;
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

	@Override
	public void run(String... args) throws Exception {
		repository.deleteAll();

		// save a couple of Surveys
		repository.save(new Survey( "Encuesta 1q 2016 LDS","Encuesta de inscripción LDS 1 cuatrimestre 2016","Completar todas las respuestas"));
		repository.save(new Survey("Encuesta 2q 2016 LDS","Encuesta de inscripción LDS 2 cuatrimestre 2016","Completar todas las respuestas"));
		repository.save(new Survey("Encuesta 1q 2016 TPI","Encuesta de inscripción TPI 1 cuatrimestre 2016","Completar todas las respuestas"));

		// fetch all Surveys
		System.out.println("Surveys found with findAll():");
		System.out.println("-------------------------------");
		for (Survey Survey : repository.getAll()) {
			System.out.println(Survey);
		}
		System.out.println();

		// fetch an individual Survey
		System.out.println("Survey found with findByName('encuesta 1q 2016'):");
		System.out.println("--------------------------------");
		System.out.println(repository.getSurvey("encuesta 1q 2016"));

		System.out.println("Surveys found with findByName('encuesta')");
		System.out.println("--------------------------------");
		for (Survey Survey : repository.getAllSurveysWithName("encuesta")) {
			System.out.println(Survey);
		}
	}
}
