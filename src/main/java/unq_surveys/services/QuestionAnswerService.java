package unq_surveys.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unq_surveys.domain.QuestionAnswer;
import unq_surveys.repositories.QuestionAnswerRepository;

/**
 * Bean de servicio, se le inyecta con autowired al repositorio
 * 
 * Spring se encarga de definir el bean con el tag @Service
 * 
 * @author eiroa
 *
 */
@Service
public class QuestionAnswerService {
	
	
	@Autowired
	private QuestionAnswerRepository repository;
	
	public void save(QuestionAnswer survey){
		repository.save(survey);
	}
	
	public QuestionAnswer getQuestionAnswer(String text){
		return repository.findByResponseText(text);
	}
	
	public List<QuestionAnswer> getAllQuestionAnswersWithName(String text){
		return repository.findAllByResponseText(text);
	}
	
	public List<QuestionAnswer> getAll(){
		return repository.findAll();
	}
	public void deleteAll(){
		repository.deleteAll();
	}

	public QuestionAnswerService(QuestionAnswerRepository repository) {
		this.repository = repository;
	}
	
	public QuestionAnswerService() {
		
	}

	public QuestionAnswerRepository getRepository() {
		return repository;
	}

	public void setRepository(QuestionAnswerRepository repository) {
		this.repository = repository;
	}
	
	
	
	

}
