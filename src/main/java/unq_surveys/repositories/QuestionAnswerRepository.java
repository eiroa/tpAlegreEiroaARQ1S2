package unq_surveys.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unq_surveys.domain.QuestionAnswer;


/**
 * Repository es un tipo de bean especial de spring para interactuar con la BD
 * MongoRepository es la clase de Spring diseñada para interactuar especificamente con Mongo
 * 
 * @author eiroa
 *
 */
@Repository
public interface QuestionAnswerRepository extends MongoRepository<QuestionAnswer,String> , CrudRepository<QuestionAnswer,String>  {
	public QuestionAnswer findByResponseText(String text);
	public List<QuestionAnswer> findAllByResponseText(String text);	
}
