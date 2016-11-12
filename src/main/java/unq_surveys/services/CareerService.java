package unq_surveys.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Service;

import unq_surveys.domain.Career;
import unq_surveys.repositories.CareerRepository;

/**
 * 
 * @author eiroa
 *
 */
@Service
public class CareerService {
	
	
	@Autowired
	private CareerRepository repository;
	
	public void save(Career career){
		repository.save(career);
	}
	
	public Career getCareer(String name){
		return repository.findByName(name);
	}
	
	public List<Career> getAllCareersWithName(String name){
		return repository.findAllByName(name);
	}
	
	public List<Career> getAll(){
		return repository.findAll();
	}
	
	public void deleteAll(){
		repository.deleteAll();
	}

	public CareerService(CareerRepository repository) {
		this.repository = repository;
	}
	
	public CareerService() {
		
	}

	public CareerRepository getRepository() {
		return repository;
	}

	public void setRepository(CareerRepository repository) {
		this.repository = repository;
	}
	
	

}
