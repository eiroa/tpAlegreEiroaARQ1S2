package unq_surveys.domain;

import java.util.HashMap;

import lombok.Data;

@Data
public class RadioQuestion extends Question {
	
		

		private HashMap<Integer , String> options;

		public HashMap<Integer , String> getOptions() {
			return options;
		}

		public void setOptions(HashMap<Integer , String> options) {
			this.options = options;
		}
		
		public RadioQuestion(){}
		
		public RadioQuestion(int id, String questionText, String description) {
			super(id, questionText, description);
			// TODO Auto-generated constructor stub
		}
		
		public RadioQuestion(String questionText) {
			super(questionText);
			this.options = new HashMap<Integer,String>();
		}
}
