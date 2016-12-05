package unq_surveys.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unq_surveys.domain.Question;
import unq_surveys.domain.Survey;
import unq_surveys.repositories.QuestionRepository;
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
public class QuestionService {
	
	
	@Autowired
	private QuestionRepository repository;
	
	public void save(Question question){
		if(question.isShared()){
			List<Question> qs = this.repository.findAllByQuestionText(question.getQuestionText());
			if(qs.isEmpty()){
				repository.save(question);
			}
		}else{
			repository.save(question);
		}
		
	}
	
	public Question getQuestion(String text){
		return repository.findByQuestionText(text);
	}
	
	public List<Question> getAllQuestionsWithQueestionText(String text){
		return repository.findAllByQuestionText(text);
	}
	
	public List<Question> getAll(){
		return repository.findAll();
	}
	public void deleteAll(){
		repository.deleteAll();
	}

	public QuestionService(QuestionRepository repository) {
		this.repository = repository;
	}
	
	public QuestionService() {
		
	}

	public QuestionRepository getRepository() {
		return repository;
	}

	public void setRepository(QuestionRepository repository) {
		this.repository = repository;
	}
	
	
	
	

}
