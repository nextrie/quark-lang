pub struct Lexer {
  code: &'static str
}

impl Lexer {
  pub fn new(code: &'static str) -> Lexer {
    Lexer { code: code, }
  } 
  pub fn lexer(&self) {
    println!("{}", self.code);
  }
}
