package unq_surveys.domain;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection="questions")
public class Question implements RadioQuestion,TextQuestion{
	
		
		@Id 
		private ObjectId id;
		
		private List<QuestionOption> options;
		
		private String questionText;
		private String description;
		private boolean isShared;
		
		

		public  Question(ObjectId id, String questionText,String description, boolean shared){
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

		public ObjectId getId() {
			return id;
		}

		public String getQuestionText() {
			return questionText;
		}

		public String getDescription() {
			return description;
		}

		@Override
		public List<QuestionOption> getOptions() {
			// TODO Auto-generated method stub
			return this.options;
		}


		@Override
		public void setOptions(List<QuestionOption> opts) {
			// TODO Auto-generated method stub
			this.options = opts;
		}

			
}

