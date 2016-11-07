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
		private String helpText;
		
		

		public  Question(int id, String questionText,String description,String helpText){
			this.id =id;
			this.questionText=questionText;
			this.description = description;
			this.helpText=helpText;
		}
//		public  Question(String questionText,String description,String helpText){
//			this.questionText=questionText;
//			this.description = description;
//			this.helpText=helpText;
//		}
		
		public Question(){
			
		}
}

