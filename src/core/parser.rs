use crate::core::lexer::{Token, Lexer};

pub struct Node {
  id: Token,
  raw: &'static str,
  children: Vec<Box<Node>>,
  parent: Box<Node>,
}

pub trait Parser {
  fn parse(&self);
}

impl Parser for Vec<Token> {
  fn parse(&self) {
    for token in self {
      println!("{}", token);
    }
  }
}