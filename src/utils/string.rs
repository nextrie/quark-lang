pub fn string_to_static(string: String) -> &'static str {
  Box::leak(string.into_boxed_str())
}