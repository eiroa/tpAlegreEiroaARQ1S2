package unq_surveys.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unq_surveys.domain.Survey;
import unq_surveys.domain.User;
import unq_surveys.repositories.UserRepository;

/**
 * Bean de servicio, se le inyecta con autowired al repositorio
 * 
 * Spring se encarga de definir el bean con el tag @Service
 * 
 * @author eiroa
 *
 */
@Service
public class UserService {
	
	
	@Autowired
	private UserRepository repository;
	
	public void save(User survey){
		repository.save(survey);
	}
	
	public User getUserByName(String name){
		return repository.findByName(name);
	}
	
	public User getUserByStudentId(int id){
		return repository.findByStudentId(id);
	}
	
	public List<User> getAllUsersWithName(String name){
		return repository.findAllByName(name);
	}
	
	public List<User> getAll(){
		return repository.findAll();
	}
	public void deleteAll(){
		repository.deleteAll();
	}

	public UserService(UserRepository repository) {
		this.repository = repository;
	}
	
	public UserService() {
		
	}

	public UserRepository getRepository() {
		return repository;
	}

	public void setRepository(UserRepository repository) {
		this.repository = repository;
	}
	
	
	
	

}
