package unq_surveys.domain;

import java.util.HashMap;

public class RadioQuestion extends Question {
		private HashMap<Long , String> options;

		public HashMap<Long , String> getOptions() {
			return options;
		}

		public void setOptions(HashMap<Long , String> options) {
			this.options = options;
		}
}