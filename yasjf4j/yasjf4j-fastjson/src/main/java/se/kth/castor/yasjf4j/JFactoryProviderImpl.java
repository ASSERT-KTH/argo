package se.kth.castor.yasjf4j;


import com.alibaba.fastjson.JSONException;
import se.kth.castor.yasjf4j.spi.JFactoryProvider;

public class JFactoryProviderImpl implements JFactoryProvider {
	@Override
	public JObject createJObject() {
		return new JObjectImpl();
	}

	@Override
	public JArray createJArray() {
		return new JArrayImpl();
	}

	private char firstNonWhitChar(String str) {
		return str.trim().charAt(0);
	}

	@Override
	public Object parse(String s) throws JException {
		char first = firstNonWhitChar(s);
		if(first == '{') {
			try {
				return new JObjectImpl(s);
			} catch (JSONException e) {
				throw new JException();
			}
		} else if (first == '[') {
			try {
				return new JArrayImpl(s);
			} catch (JSONException e) {
				throw new JException();
			}
		} else {
			throw new JException();
		}
	}

	@Override
	public void initialize() {

	}
}
