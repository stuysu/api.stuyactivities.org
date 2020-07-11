# quicker-picker-upper

Template for quick NodeJS prototyping and development

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Quick Start

1. Instal NodeJS on your computer if you haven't done so already: https://nodejs.org/en/download/
2. Click the "Use this template" button on GitHub, right of the "Clone or download" button and give your repository a name.
3. Clone your new repository to your computer.
4. `cd` into your repository's directory and install dependencies:

```shell
npm install
```

5. That's it, you can start developing!

-   If you want your app to automatically restart upon file changes, run it with the following command:
    ```shell
    npm run dev
    ```

## Why use it?

-   [x] Has the things you'll need, less time setting up
    -   Rolling sessions, connected to the database, with signed cookies
    -   Simple, modular routing structure
    -   Body and cookie parsers
-   [x] Stop worrying about configuring a database
    -   Uses [Sequelize ORM](https://sequelize.org/).
    -   Define your schema once and have it work with `mysql`, `postgres`, `sqlite`, or `mariadb` out of the box
    -   The app will automatically create a sqlite3 database with the name `app.db` if you don't provide a database
-   [x] Continuous integration.
    -   Encourages unit-testing
    -   GitHub workflow, with caching, already set up
    -   Tests your code, in parallel on NodeJS 10.x and 12.x, as well as with every database type, on every commit or pull request
-   [x] [Prettier](https://prettier.io/)-ready
    -   Automatically format your code with `npm run prettier`
    -   Spend more time writing code and less time worrying about formatting
-   [x] Production Ready
    -   Creates clusters to distribute load across cpu cores
    -   Instantly revives child processes if they die. Your entire app won't go offline if something crashes in production.
    -   Pooling of database connections allows for quicker access to data
-   [x] PaaS Ready (Platform as a Service)
    -   Instantly deploy on Heroku or AWS Elastic Beanstalk with ease
    -   Most configuration happens using environment variables

## Databases

Define your schema using [Sequelize CLI](https://github.com/sequelize/cli)

Have a database already? You can use it with the app by setting the `SEQUELIZE_URL` environment varible. You can do this in a .env file like so:

```dotenv
SEQUELIZE_URL=mysql://user:password@localhost/my_db
```

## Testing

Testing happens with the [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) libraries.
By default, mocha will look for tests inside of the `test/` directory. You can alter the mocha configuration in the `package.json` file/
