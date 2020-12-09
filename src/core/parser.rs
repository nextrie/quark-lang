use crate::core::lexer::{Token, Lexer};

pub struct Node {
  id: Token,
  raw: &'static str,
  children: Vec<Box<Node>>,
  parent: Box<Node>,
}

