package unq_surveys.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
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
		
		public Survey(){};
		
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
		
		
		
	   
}
