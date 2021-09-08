![Logo](assets/logo_with_text_light.svg)

# officr

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/gheinzer/officr?color=%23d40000&include_prereleases&logo=github&style=for-the-badge)
![WebApp](https://img.shields.io/website?down_color=red&label=webapp&style=for-the-badge&up_color=green&url=http%3A%2F%2Fofficr.gabrielheinzer.ch&)

# What is it?

Officr is mainly a todo list to rember things like homework and meetings. I wrote this for me, but maybe, someone is interested to try it put and post an issue, if something does not work.

# Installation

1. Download officr:
   `git clone https://github.com/gheinzer/officr.git`

2. Install the required modules (See [here](#Required_modules))
3. Start the back-end by running `(sudo) node server.js`

# Requirements

-   You should have installed `node.js` on your machine
-   You should be able to install npm modules
-   git should be installed on your machine
-   You should have installed a mysql server

## Required modules

**The required modules are saved in the node_modules directory by default.**

### Normally not installed modules

-   `mysql` (Install with `(sudo) npm install mysql`)

### Preinstalled modules (Don't need to be installed normally)

-   `cluster`
-   `child_process`
-   `path`
-   `fs`
-   `http`
-   `crypto`
-   `ws`
-   `readline`
