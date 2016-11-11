package unq_surveys.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unq_surveys.domain.Subject;


/**
 * Repository es un tipo de bean especial de spring para interactuar con la BD
 * MongoRepository es la clase de Spring diseñada para interactuar especificamente con Mongo
 * 
 * @author eiroa
 *
 */
@Repository
public interface SubjectRepository extends MongoRepository<Subject,String> , CrudRepository<Subject,String>  {
	public Subject findByName(String name);
	public List<Subject> findAllByName(String name);	
}
