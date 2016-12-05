package unq_surveys.services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unq_surveys.domain.Subject;
import unq_surveys.repositories.SubjectRepository;

/**
 * 
 * @author eiroa
 *
 */
@Service
public class SubjectService {
	
	
	@Autowired
	private SubjectRepository repository;
	
	public void save(Subject Subject){
		if(Subject.isShared()){
			List<Subject>ss = this.repository.findAllByName(Subject.getName());
			if(ss.isEmpty()){
				repository.save(Subject);
			}
		}else{
			repository.save(Subject);
		}
		
	}
	
	public Subject getSubjectByName(String name){
		return repository.findByName(name);
	}
	
	public List<Subject> getAllSubjectsWithName(String name){
		return repository.findAllByName(name);
	}
	
	public List<Subject> getAll(){
		return repository.findAll();
	}
	
	public void deleteAll(){
		repository.deleteAll();
	}

	public SubjectService(SubjectRepository repository) {
		this.repository = repository;
	}
	
	public SubjectService() {
		
	}

	public SubjectRepository getRepository() {
		return repository;
	}

	public void setRepository(SubjectRepository repository) {
		this.repository = repository;
	}
	
	
	
	

}
