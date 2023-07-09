# api.stuyactivities.org

Backend for [StuyActivities.org](https://stuyactivities.org)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Quick Start

1. Instal NodeJS on your computer if you haven't done so already: https://nodejs.org/en/download/
2. Click the "Use this template" button on GitHub, right of the "Clone or download" button and give your repository a name.
3. Clone your new repository to your computer.
4. `cd` into your repository's directory and install dependencies:

```shell
npm install
```

5. export all .env variables in your terminal. Please ask one of the IT Directors to send you the .env if you do not have it.

```shell
export ENV_VARIABLE1=...
export ENV_VARIABLE2=...
export ENV_VARIABLE3=...
```

7. Run `npm run migrate`
8. Run `npm run authenticate` and follow the instructions in your terminal. YOU MUST USE YOUR STUYSU EMAIL FOR AUTHENTICATION.

9. That's it, you can start developing!

-   If you want your app to automatically restart upon file changes, run it with the following command:
    ```shell
    npm run dev
    ```

## Databases

The models and migrations are created using [Sequelize CLI](https://github.com/sequelize/cli)

Have a database already? You can use it with the app by setting the `SEQUELIZE_URL` environment varible. You can do this in a .env file like so:

```dotenv
SEQUELIZE_URL=mysql://user:password@localhost/my_db
```

Otherwise, if the `SEQUELIZE_URL` env variable is not set, a sqlite database will be created in the root of the app.

## Testing

Testing happens with the [mocha](https://mochajs.org/) and [chai](https://www.chaijs.com/) libraries.
By default, mocha will look for tests inside of the `test/` directory. You can alter the mocha configuration in the `package.json` file/
