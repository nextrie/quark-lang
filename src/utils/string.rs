pub fn string_to_static(string: String) -> &'static str {
  Box::leak(string.into_boxed_str())
}

pub fn str_to_static(string: &str) -> &'static str {
  string_to_static(String::from(string))
}