package unq_surveys.rest;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.ExposesResourceFor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unq_surveys.domain.Survey;
import unq_surveys.services.SurveyService;

/**
 * El Bean del servicio Rest, Spring se encarga de generar el bean 
 * y exponer los servicios acordes a la definicion de cada metodo, se utiliza el tag @RestController
 * 
 * Se definen las rutas de los servicios con el tag @RequestMapping
 * 
 * Spring se encarga de inyectar el servicio de surveyService usando @Autowired
 * 
 * @author eiroa
 *
 */
@RestController
public class SurveyRest {

    @Autowired
	private SurveyService surveyService;
    
    public HttpEntity<List<Survey>> getSurveys() {
    	
        List<Survey>  ss = surveyService.getAll();
       ss.stream().forEach(s -> {
//    	   s.add(linkTo(methodOn(SurveyRest.class).getSurveys()).withSelfRel());
       });
        
        return new ResponseEntity<List<Survey>>(ss, HttpStatus.OK);
    }
}
