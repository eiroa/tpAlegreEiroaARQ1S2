package unq_surveys.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
public class Question {
	
		
		@Id 
		private String id;
		
		private String questionText;
		private String description;
		private boolean isShared;
		
		

		public  Question(String id, String questionText,String description, boolean shared){
			this.id =id;
			this.questionText=questionText;
			this.description = description;
			this.isShared = shared;
		}
		
		public Question(){
			
		}

		public Question(String questionText) {
			this.questionText = questionText;
		}

		public Question(String questionText2, boolean isShared) {
			this.questionText = questionText2;
			this.isShared = isShared;
		}

		public String getId() {
			return id;
		}

		public String getQuestionText() {
			return questionText;
		}

		public String getDescription() {
			return description;
		}

			
}

