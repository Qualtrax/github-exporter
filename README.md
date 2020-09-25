# tsbase-boilerplate

Use this project to get up and running using tsbase and tsbase-components.

## Installation

Ensure you have [node/npm](https://nodejs.org/en/) installed.

- Run `npm install` in the root directory of this repository

## Local Development

### Clean the project
 - Remove existing `.git` folder so you can init your own (`npm run clean`).
 - Update the appropriate tags in `src/wwwroot/index.html`
 ```html
  <title>{Your app's name}</title>
  <meta name="description" content="{description for your app}">
  <meta name="author" content="{your name / company name}">
 ```
 - Update `src/wwwroot/images/faicon.png`

### Serving

- Run `npm start` | This command will:
  - compile Sass (.scss) into CSS (.css)
  - compile TypeScript into a JavaScript bundle
  - serve the site using http-server at: [http://localhost:4200/](http://localhost:4200/)

### Testing / linting

- Run `npm test` to watch all tests
- Run `npm run test-once` to run all tests once
- Run `npm run lint` to check for linting errors

### VSCode Extensions - Install these for the best experience
- Quick scaffolding [tsbase-snipeets](https://marketplace.visualstudio.com/items?itemName=JosephBayes.tsbase-snippets)
- Html highlighting in component files [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)

### Debugging in VSCode:

`launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200/",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Karma Chrome",
      "address": "localhost",
      "port": 9333,
      "pathMapping": {
        "/": "${workspaceRoot}",
        "/base/": "${workspaceRoot}/"
      }
    }
  ]
}
```

## Deployment

### Local Production Build

**Without** Pre-render

1. `npm run copy-static-files`
2. `npm run build`
3. Deploy the `./public` folder

**With** Pre-render

1. `npm run publish`
2. Deploy the `./public` folder
