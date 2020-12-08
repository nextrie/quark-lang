use crate::string_to_static;
use std::fmt::{Display, Formatter, Error};

pub struct Lexer {
  code: &'static str
}

enum Tokens {
  Node,
  //Keyword,
  String,
  //Number,
}

pub struct Token {
  token: Tokens,
  value: &'static str
}

impl Lexer {
  pub fn new(code: &'static str) -> Lexer {
    Lexer { code, }
  } 
  pub fn lexer(&self) -> Vec<Token> {
    let mut state: &str = "";
    let mut tokens: Vec<Token> = vec![];
    let mut tmp: Vec<&str> = vec![];
    let split: Vec<&str> = self.code.split("").collect();
    for char in split {
      if ["{", "}", "(", ")"].contains(&char) {
        tokens.push(Token { token: Tokens::Node, value: char });
      } else if char == "\"" {
        tmp.push(char);
        if state == "STRING" {
          state = "";
          tokens.push( Token { token: Tokens::String, value: string_to_static(tmp.join("")) });
          tmp.clear();
        } else {
          state = "STRING";
        }
      } else if char == " " && tmp.len() > 0 {
        if state == "STRING" {
          tmp.push(char);
        } else {
          state = "";
          tokens.push( Token { token: Tokens::String, value: string_to_static(tmp.join("")) });
          tmp.clear();
        }
      } else {
        tmp.push(char);
      }
    }
    tokens
  }
}

impl Display for Token {
  fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
    write!(f, "{{ token: ").unwrap();
    match self.token {
      Tokens::Node => write!(f, "Node").unwrap(),
      Tokens::String => write!(f, "String").unwrap()
    };
    write!(f, ", value: \"{}\" }}", self.value).unwrap();
    Ok(())
  }
}
