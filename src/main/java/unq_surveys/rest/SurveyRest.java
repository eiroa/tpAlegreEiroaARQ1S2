package unq_surveys.rest;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unq_surveys.domain.Survey;
import unq_surveys.services.SurveyService;

import org.springframework.beans.factory.annotation.Autowired;

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
    
    @RequestMapping("/surveys")
    public List<Survey> getSurveys() {
        return surveyService.getAll();
    }
}
