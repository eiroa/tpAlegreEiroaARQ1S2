package unq_surveys.domain;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


public interface RadioQuestion {
	
	List<QuestionOption> getOptions();
	
	void setOptions(List<QuestionOption>opts);
	
	
//	public RadioQuestion(ObjectId id, String questionText, String description, boolean isShared) {
//		super(id, questionText, description, isShared);
//	}
//	
//	public RadioQuestion(String questionText) {
//		super(questionText);
//	}
//
//	public RadioQuestion(String questionText, boolean isShared) {
//		super(questionText, isShared);
//	}

//		
//		@Override
//		public String toString(){
//			return " RadioQuestion: Id:"+this.getId()+ " , text: "+ this.getQuestionText() + "  ";
//		}
}
