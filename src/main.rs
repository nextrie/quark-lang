mod utils;
mod core;
use regex::{Regex, Split};
use std::fs;
use crate::core::lexer::Lexer;
use crate::utils::string::{string_to_static, str_to_static};

fn main() {

  let file = fs::read_to_string("sample/index.qrk");
  if file.is_err() { return println!("An error occured during file reading..."); }
  let re: Regex = Regex::new(r"\r?\n").unwrap();
  let mut content: Vec<&str> = regex_to_array(re.split(&file.unwrap()));

  format_code(&mut content);
  let code: String = content.join("");

  let lexer = Lexer::new(string_to_static(code));
  lexer.lexer();
}

fn regex_to_array(re: Split) -> Vec<&'static str> {
  let mut result: Vec<&'static str> = vec![];
  for el in re  { result.push(str_to_static(el)) }
  result
} 

fn format_code(code: &mut Vec<&str>) {
  for el in code { *el = el.trim(); }
}