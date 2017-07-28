# Description

This repo is a Typescript + React adaption of https://github.com/wpp/ScreenStream.

# Requirements

- npm
- node

# Getting started

After you clone the repo, install the dependencies:

```
npm install
```

Then, make an intial build of the extension:


```
npm run build:extension
```

After you build the extension, you need to load the extension into chrome. Visit chrome://

1. Go to chrome://extensions
2. Check "Developer mode"
3. Click "Load unpacked extension..."
4. In the dialog choose the extension folder from the repository

After installing the extension, start the server:

```
npm start
```

This will watch and re-build your source and make it available on http://localhost:8080.