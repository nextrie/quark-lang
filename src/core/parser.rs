use crate::core::lexer::{Tokens, Lexer, Token};

pub struct Node {
  id: Tokens,
  raw: &'static str,
  children: Vec<Box<Node>>,
  parent: Option<Box<Node>>,
}

pub trait Parser {
  fn parse(&self, index: i8, ast: Node);
}

impl Node {
  pub fn new(id: Option<Tokens>, raw: Option<&'static str>) -> Node {
    let _id: Tokens = if id.is_none() { Tokens::Node } else { id.unwrap() };
    let _raw: &str = if raw.is_none() { "" } else { raw.unwrap() };
    Node {
      id: _id,
      raw: _raw,
      children: vec![],
      parent: None
    }
  }
}

impl Parser for Vec<Token> {
  fn parse(&self, index: i8, ast: Node) {
    for token in self {
      println!("{}", token);
    }
  }
}