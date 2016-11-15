package unq_surveys.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unq_surveys.domain.Survey;
import unq_surveys.domain.User;


/**
 * Repository es un tipo de bean especial de spring para interactuar con la BD
 * MongoRepository es la clase de Spring diseñada para interactuar especificamente con Mongo
 * 
 * @author eiroa
 *
 */
@Repository
public interface UserRepository extends MongoRepository<User,String> , CrudRepository<User,String>  {
	public User findByName(String name);
	public List<User> findAllByName(String name);	
}
