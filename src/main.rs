mod utils;
use std::io::Error;
use utils::file::*;

fn main() {
  let file: File = File {
    path: "sample/index.qrk"
  };
  let content: Result<&str, Error> = file.read();
  if content.is_err() {
    println!("test");
  }
  println!("{}", content.unwrap());
}
