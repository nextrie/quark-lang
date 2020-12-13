<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="assets/logo.png" alt="Project logo"></a>
</p>

<h3 align="center">Quark lang</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/thomasvergne/quark-lang.svg)](https://github.com/thomasvergne/quark-lang/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/thomasvergne/quark-lang.svg)](https://github.com/thomasvergne/quark-lang/pulls)
[![License](https://img.shields.io/badge/license-Creative%20commons-blue.svg)](/LICENSE)
[![BCH compliance](https://bettercodehub.com/edge/badge/thomasvergne/quark-lang?branch=master)](https://bettercodehub.com/)
[![Discord](https://discordapp.com/api/guilds/738827425043185717/widget.png?style=shield)](https://discord.gg/sXwE5Dp)
 
</div>

---

<p align="center"> 
    Quark is a compiled programming language written in Typescript.
    <br> 
</p>

## 📝 Table of Contents

-   [About](#about)
-   [Getting Started](#getting_started)
-   [Manual installation](#manual)
-   [Build](#build)
-   [Development](#dev)
-   [Usage](#usage)
-   [TODO](./TODO.md)
-   [Contributing](./CONTRIBUTING.md)
-   [Authors](#authors)

## 🧐 About <a name = "about"></a>

The main goal of Quark is to offer a language that combines simplicity and
productivity in addition to its cool and easy syntax.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. See
[Manual installation](#manual) for notes on how to install the project on a live
system.

### Prerequisites

To install Quark, you will need:

```
Deno >= 1.6.0
```

### Installing

---

## 🔧 Running the tests <a name = "tests"></a>

To run the tests:

```
 deno test
```

### Break down into end to end tests

No tests for the moment.

### And coding style tests

The linter is present in order to allow anyone to be able to contribute while
being in the main coherence of the code.

```
 deno lint
```

## 🎈 Usage <a name="usage"></a>

No usage informations for the moment.

## 🚀 Manual installation <a name = "manual"></a>

To deploy Quark lang, do:

```bash
 $ git clone git@github.com:thomasvergne/quark-lang.git

 # OR

 $ git init
 $ git remote add origin git@github.com:thomasvergne/quark-lang.git
 $ git pull

```

## 🚀 Build <a name = "build"></a>

To build the project, do:

```bash
 $ deno compile --unstable src/main.ts -o quark-lang
 $ quark-lang

 # OR

 $ docker build -t quark-lang .
 $ docker run -it --rm quark-lang

```

## 🖥️ Development <a name="dev"></a>
Many tools are provided with Quark in order to facilitate development.

```bash
 # Compile the script runner.
 $ deno compile --unstable src/utils/script.ts -o dr

 # Execute the script runner.
 $ ./dr <script>
```

## ✍️ Authors <a name = "authors"></a>

-   [@thomasvergne](https://github.com/thomasvergne) - Idea & Initial work

See also the list of
[contributors](https://github.com/thomasvergne/quark-lang/contributors) who
participated in this project.
