<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="assets/logo.png" alt="Project logo"></a>
</p>

<h3 align="center">Quark lang</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/NessMC/quark-lang.svg)](https://github.com/NessMC/quark-lang/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/NessMC/quark-lang.svg)](https://github.com/NessMC/quark-lang/pulls)
[![License](https://img.shields.io/badge/license-Creative%20commons-blue.svg)](/LICENSE)
[![BCH compliance](https://bettercodehub.com/edge/badge/NessMC/quark-lang?branch=master)](https://bettercodehub.com/)
[![Discord](https://discordapp.com/api/guilds/738827425043185717/widget.png?style=shield)](https://discord.gg/sXwE5Dp)
 
</div>

---

<p align="center"> 
    Quark is a compiled programming language written in TypeScript.
    <br> 
</p>

## 📝 Table of Contents

-   [About](#about)
-   [Getting Started](#getting_started)
-   [Manual installation](#manual)
-   [Build](#build)
-   [Usage](#usage)
-   [TODO](./TODO.md)
-   [Contributing](./CONTRIBUTING.md)
-   [Authors](#authors)

## 🧐 About <a name = "about"></a>

The main goal of Quark is to offer a language that combines simplicity and
productivity in addition to its cool syntax.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See
[Manual installation](#manual) for notes on how to install the project on a live
system.

### Prerequisites

To install Quark, you will need:

```
Node.JS > 13
NPM > 6
```

### Installing

---

## 🔧 Running the tests <a name = "tests"></a>

To run the tests:

```
 npm run test
```

### Break down into end to end tests

No tests for the moment.

### And coding style tests

The linter is present in order to allow anyone to be able to contribute while
being in the main coherence of the code.

```
 npm run lint
```

## 🎈 Usage <a name="usage"></a>

No usage informations for the moment.

## 🚀 Manual installation <a name = "manual"></a>

To deploy Quark lang, do:

```bash
 $ git clone git@github.com:NessMC/quark-lang.git

 # OR

 $ git init
 $ git remote add origin git@github.com:NessMC/quark-lang.git
 $ git pull

 # OR

 $ docker pull nessmcfr/quark-lang
 $ docker run nessmcfr/quark-lang
```

## 🚀 Build <a name = "build"></a>

To build the project, do:

```bash
 $ npm run bundle 
 # That generate file called bundle.js, just run it with : node dist/bundle.js

 # OR

 $ docker-compose build
 # OR
 $ yarn docker:build

 $ docker run quark-lang_app
 # OR
 $ yarn docker:start

```

## ✍️ Authors <a name = "authors"></a>

-   [@NessMC](https://github.com/NessMC) - Idea & Initial work

See also the list of
[contributors](https://github.com/NessMC/quark-lang/contributors) who
participated in this project.
