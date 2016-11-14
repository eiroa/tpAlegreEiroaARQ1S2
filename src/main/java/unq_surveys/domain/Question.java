package unq_surveys.domain;

//import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

import lombok.Data;

@Data
public class Question {
	
		
		private int id;
		
		private String questionText;
		private String description;
		
		

		public  Question(int id, String questionText,String description){
			this.id =id;
			this.questionText=questionText;
			this.description = description;
		}
		
		public Question(){
			
		}

		public Question(String questionText) {
			this.questionText = questionText;
		}

		public int getId() {
			return id;
		}

		public String getQuestionText() {
			return questionText;
		}

		public String getDescription() {
			return description;
		}

			
}

