package unq_surveys.domain;

import lombok.Data;

@Data
public class QuestionOption {
	

		private Integer key;
		private String text;
		
		public QuestionOption(){}
		
		public QuestionOption(int key, String text) {
			super();
			this.setKey(key);
			this.setText(text);
		}
		
}
