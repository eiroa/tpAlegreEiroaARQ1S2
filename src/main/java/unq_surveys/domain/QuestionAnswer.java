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
		private User user;
		private List<Integer>selectedOptions;
		private Question question;
		
		public QuestionAnswer(){}
		
		public QuestionAnswer(String responseText) {
			super();
			this.setResponseText(responseText);
		}
		
		public QuestionAnswer(List<Integer> selectedOptions) {
			super();
			this.setSelectedOptions(selectedOptions);
		}
		
		public QuestionAnswer(String responseText, List<Integer> optionsSelected) {
			super();
			this.setResponseText(responseText);
			this.setSelectedOptions(optionsSelected);
		}
		
		
		public QuestionAnswer(String responseText, List<Integer> optionsSelected,User user) {
			super();
			this.setResponseText(responseText);
			this.setSelectedOptions(optionsSelected);
			this.setUser(user);
		}
		
		public QuestionAnswer(Question q, String responseText, List<Integer> optionsSelected,User user) {
			super();
			this.setQuestion(q);
			this.setResponseText(responseText);
			this.setSelectedOptions(optionsSelected);
			this.setUser(user);
		}
		
		
}
