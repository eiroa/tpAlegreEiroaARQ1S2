package unq_surveys.domain;

import lombok.Data;

@Data
public abstract class Question {

		private String questionText;
		private String description;
		private String helpText;
}
