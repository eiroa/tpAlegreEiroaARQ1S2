package unq_surveys.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unq_surveys.domain.Career;
import unq_surveys.services.CareerService;

/**
 * 
 * @author eiroa
 *
 */
@RestController
public class CareerRest {

    @Autowired
	private CareerService careerService;
    
    @RequestMapping("/careers")
    public List<Career> getCareers() {
        return careerService.getAll();
    }
}
