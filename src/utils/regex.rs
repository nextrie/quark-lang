use regex::{Split};
use crate::utils::string::str_to_static;

pub fn regex_to_array(re: Split) -> Vec<&'static str> {
  let mut result: Vec<&'static str> = vec![];
  for el in re  { result.push(str_to_static(el)) }
  result
} 