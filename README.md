<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://trac-kl33.onrender.com">
    <img src="public/images/trac_logo_blue_circle_150px.png" alt="Logo" width="125" height="125">
  </a>
<br />
  <h1 align="center">Trac</h1>

  <p align="center">
    The goal-tracking app that keeps you accountable.
    <br />
    <a href="https://trac-kl33.onrender.com">https://trac-kl33.onrender.com</a>
</div>



<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details> -->



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot][product-screenshot]

 Trac is a web application for tracking goals and holding users accountable through updates to their social circle. A user creates Goals with a due date, then gives each Goal any number of Habits, which are tasks that need to be completed weekly in order to meet the Goal by the Goal's due date. The user also chooses a day of the week for each Habit to be its Check-In Day. Each week on that day, Trac will prompt the user via email and within the app to send an update on the Habit's progress to their friends directly from Trac. Research shows that being accountable to others helps people follow through with goals. Trac builds that functionality right into the app.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features
* Password encryption using bcrypt
* Password strength, email, and username validation
* Authentication and authorization implemented using bcrypt and JSON web tokens
* Add Goals to dashboard and add Habits to Goals
* Choose what days of the week to practice your Habit (aka a Habit Routine)
* Pleasing, intuitive visual layout for Goal and Habits:
  * When Habit is collapsed: see Habit name and whether or not today is a day in Habit's routine 
  * When Habit is expanded: change Habit, track the days Habits are practiced, and view all days in since Habit was created till Goal's due date.
* Receive email and in-app reminders for Check-In Days
* Compose and send Check-In Day emails directly from app

### Database Schema

![schema](/public/images/schema.png)
### Built With

* [![Typescript][Typescript]][Typescript-url]
* [![React][React.js]][React-url]
* [![Redux][Redux]][Redux-url]
* [![Redux Toolkit][Redux Toolkit]][Redux-Toolkit-url]
* [![Express][Express.js]][Express-url]
* [![Node.js][Nodejs.org]][Node-url]
* [![PostgreSQL][PostgreSQL.org]][PostgreSQL-url]
* [![Prisma][Prisma.io]][Prisma-url]
* [![Chakra UI][Chakra-ui.com]][Chakra-url]
* [![Vite][Vitejs.dev]][Vite-url]
* [Knock](https://knock.app) - An all-in-one app notification system and platform.
* [Nodemailer](https://nodemailer.com) - A module for Node.js applications to allow easy email sending.
* [node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js#readme) - A bcrypt library for Node.js.
* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#jsonwebtoken) - An implementation of JSON Web Tokens for Node.js.
* [check-password-strength](https://github.com/deanilvincent/check-password-strength#readme) - A password strength checker based from Javascript RegEx.
* [Vite + Express](https://github.com/szymmis/vite-express#readme) - A Vite integration module for Express.js.
* [Render](https://www.render.com) - A cloud application hosting service for developers.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Contributors

Dara Yazdani - dara.s.yazdani@gmail.com • [linkedin.com/in/darayazdani](https://www.linkedin.com/in/darayazdani) • [github.com/dyazdani](https://www.github.com/dyazdani)<br>
[Josh van Eyken](https://www.joshvaneyken.com) - josh.vaneyken@gmail.com • [linkedin.com/in/joshvaneyken](https://linkedin.com/in/joshvaneyken) • [github.com/jvaneyken](https://github.com/jvaneyken)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: public/images/README-screenshot-1.png
[Express.js]: https://img.shields.io/badge/Express.js-grey?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript]: https://img.shields.io/badge/TypeScript-lightgrey?style=for-the-badge&logo=TypeScript&logoColor=blue
[Typescript-url]: https://www.typescriptlang.org
[Redux]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=whitee
[Redux-url]: https://redux.js.org
[Redux Toolkit]: https://img.shields.io/badge/redux_toolkit-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[Redux-Toolkit-url]: https://redux-toolkit.js.org
[Nodejs.org]: https://img.shields.io/badge/node.js-%23417E38.svg?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Vitejs.dev]: https://img.shields.io/badge/vite-%23A058FE.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev
[PostgreSQL.org]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org
[Prisma.io]: https://img.shields.io/badge/prisma-%234C51BF.svg?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io
[Chakra-ui.com]: https://img.shields.io/badge/Chakra_UI-%233FC7BF.svg?style=for-the-badge&logo=chakra-ui&logoColor=white
[Chakra-url]: https://www.chakra-ui.com