# Content
- [About the Project](#about-the-project)
- [Installation](#installation)
- [Live Preview](#live-preview)

# About the Project
This is an ecommerce website, that is built with:

- ASP.NET Core
- Entity Framework
- SQL Server
- Stripe
- ReactJS
- SCSS
- Bootstrap

The website allows users to create accounts, browse products, add items to their cart, checkout, view order history, and more.

# Installation

- ## Server Side

1- create a `appsettings.json` file, and fill the required strings as specified in `appsettings.development.json` with your own keys and credentials.

2- You'll need to connect to your own database, which needs to have the following schema:

![Scheama](https://user-images.githubusercontent.com/26127333/110303374-2ff89200-805f-11eb-852c-165aef74bfee.png)

- ## Client Side
1- Go to `ClientApp/src/pages/checkout/credentials/credentials.example.js`, rename the file to `credentials.js` and add your own stripe publish key in it.

2- Run `npm install` in the terminal

# Live Preview
The live website can be accessed from this link:
https://shopaholic.azurewebsites.net/