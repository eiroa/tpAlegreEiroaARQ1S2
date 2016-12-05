package unq_surveys.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class QuestionAnswer {
	
        @Id
		private String id;
		private String responseText;
		
		private List<Integer>selectedOptions;
		
		public QuestionAnswer(){}
		
		public QuestionAnswer(String responseText) {
			super();
			this.setResponseText(responseText);
		}
		
		public QuestionAnswer(List<Integer> optionsSelected) {
			super();
			this.setSelectedOptions(optionsSelected);
		}
		
		public QuestionAnswer(String responseText, List<Integer> optionsSelected) {
			super();
			this.setResponseText(responseText);
			this.setSelectedOptions(optionsSelected);
		}
		
}
