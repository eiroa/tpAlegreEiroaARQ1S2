package unq_surveys.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

/**
 * Definicion de una encuesta
 * Se requiere definir un id y constructor vacio para mongo
 * Notar el annotation Data, este annotation lo provee la libreria lombok, reduce drásticamente
 * el "boilerplate" de java, al agregar automáticamente getters, setters, constructors, toString, hash, equals, etc
 * 
 * @author eiroa
 *
 */
@Document
@Data
public class Survey {
	
		@Id 
		private String id;
		
		private String name;
		private String description;
		private String helpText;
		
		//Version permite incrementar la versión del objeto y asegura un optimistic lock
		private @Version @JsonIgnore Long version;
		
		@DBRef
		private List<Question> questions;
		
		
		public Survey(){};		
		
		public Survey(String name) {			
			this.name = name;
		}


		public Survey(String id,String name, String description, String helpText) {
			super();
			this.id = id;
			this.name = name;
			this.description = description;
			this.helpText = helpText;
		}

		public Survey(String name, String description, String helpText) {
			super();
			this.name = name;
			this.description = description;
			this.helpText = helpText;
		}
		
		public Survey(String name, String description, String helpText,List<Question> questions) {
			super();
			this.name = name;
			this.description = description;
			this.helpText = helpText;
			this.questions = questions;
		}


		public String getName() {
			return name;
		}

		public String getDescription() {
			return description;
		}

		public String getHelpText() {
			return helpText;
		}

		public Long getVersion() {
			return version;
		}

		public List<Question> getQuestions() {
			return questions;
		}

		public void setName(String name) {
			this.name = name;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public void setHelpText(String helpText) {
			this.helpText = helpText;
		}

		public void setVersion(Long version) {
			this.version = version;
		}

		public void setQuestions(List<Question> questions) {
			this.questions = questions;
		}
		
		
				  
}
