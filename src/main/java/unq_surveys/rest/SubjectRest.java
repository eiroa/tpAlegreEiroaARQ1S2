package unq_surveys.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unq_surveys.domain.Subject;
import unq_surveys.services.SubjectService;

/**
 * 
 * @author eiroa
 *
 */
@RestController
public class SubjectRest {

    @Autowired
	private SubjectService subjectService;
    
    @RequestMapping("/subjects")
    public List<Subject> getSubjects() {
        return subjectService.getAll();
    }
}
