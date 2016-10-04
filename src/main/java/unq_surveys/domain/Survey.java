package unq_surveys.domain;

import org.springframework.data.annotation.Id;

/**
 * Definicion de una encuesta
 * Se requiere definir un id y constructor vacio para mongo
 * Se recomienda tambien tener un toString
 * 
 * @author eiroa
 *
 */
public class Survey {
	
		@Id
		private String id;
		
		private String name;
		private String description;
		private String helpText;
		
		public Survey(){};
		
		public Survey(String id,String name, String description, String helpText) {
			super();
			this.id = id;
			this.name = name;
			this.description = description;
			this.helpText = helpText;
		}
		
		
		
		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public String getHelpText() {
			return helpText;
		}

		public void setHelpText(String helpText) {
			this.helpText = helpText;
		}

		@Override
		public String toString(){
			return String.format("Survey[id=%s, name='%s']",
	                id, name);
			
		}
		
	   
}
