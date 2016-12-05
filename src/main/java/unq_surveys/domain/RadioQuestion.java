package unq_surveys.domain;

import java.util.LinkedList;

import lombok.Data;

@Data
public class RadioQuestion extends Question {
	
		

		private LinkedList<QuestionOption> options = new LinkedList<QuestionOption>();


		public RadioQuestion(){}
		
		public RadioQuestion(String id, String questionText, String description, boolean isShared) {
			super(id, questionText, description, isShared);
		}
		
		public RadioQuestion(String questionText) {
			super(questionText);
		}

		public RadioQuestion(String questionText, boolean isShared) {
			super(questionText, isShared);
		}
}
