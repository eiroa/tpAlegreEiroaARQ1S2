package unq_surveys.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Service;

import unq_surveys.domain.Survey;
import unq_surveys.repositories.SurveyRepository;

/**
 * Bean de servicio, se le inyecta con autowired al repositorio
 * 
 * Spring se encarga de definir el bean con el tag @Service
 * 
 * @author eiroa
 *
 */
@Service
public class SurveyService {
	
	
	@Autowired
	private SurveyRepository repository;
	
	public void save(Survey survey){
		repository.save(survey);
	}
	
	public Survey getSurvey(String name){
		return repository.findByName(name);
	}
	
	public List<Survey> getAllSurveysWithName(String name){
		return repository.findAllByName(name);
	}
	
	public List<Survey> getAll(){
		return repository.findAll();
	}
	
	public void deleteAll(){
		repository.deleteAll();
	}

	public SurveyService(SurveyRepository repository) {
		this.repository = repository;
	}
	
	public SurveyService() {
		
	}

	public SurveyRepository getRepository() {
		return repository;
	}

	public void setRepository(SurveyRepository repository) {
		this.repository = repository;
	}
	
	
	
	

}
