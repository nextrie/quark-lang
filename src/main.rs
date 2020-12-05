mod utils;
use regex::{Regex, Split};
use std::fs;

fn main() {
  let file = fs::read_to_string("sample/index.qrk");
  if file.is_err() {
    return println!("An error occured during file reading...");
  }
  let re: Regex = Regex::new(r"\r?\n").unwrap();
  let content: Vec<&str> = regex_to_array(re.split(&file.unwrap()));
  println!("{:?}", content);
}

fn regex_to_array(re: Split) -> Vec<&'static str> {
  let mut result: Vec<&'static str> = vec![];
  for el in re  { result.push(Box::leak(String::from(el).into_boxed_str())) }
  result
} 
