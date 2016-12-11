package unq_surveys.domain;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection="questions")
public class RadioQuestion extends Question {
	

	private List<QuestionOption> options;


	public RadioQuestion(){}
	
	public RadioQuestion(ObjectId id, String questionText, String description, boolean isShared) {
		super(id, questionText, description, isShared);
	}
	
	public RadioQuestion(String questionText) {
		super(questionText);
	}

	public RadioQuestion(String questionText, boolean isShared) {
		super(questionText, isShared);
	}

		
		@Override
		public String toString(){
			return " RadioQuestion: Id:"+this.getId()+ " , text: "+ this.getQuestionText() + "  ";
		}
}
