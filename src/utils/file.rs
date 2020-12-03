use std::fs;
use std::io::Error;
use crate::utils::string;

// Structure containing file informations.
pub struct File {
  pub path: &'static str,
}

impl File {
  // Reading file function
  pub fn read(&self) -> Result<&'static str, Error> {
    // Trying reading the file.
    let response: Result<&'static str, Error> = || -> Result<&'static str, Error> {
      let content = fs::read_to_string(&self.path)?;
      Ok(string::string_to_static(content))
    }();
    // Returning the response (content or error)
    response
  }
}
