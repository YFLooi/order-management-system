## Running this repo

Install packages by running `yarn install`

To change the localhost port, go to package.json and set the following:
``` json
"scripts": {
  "dev": "next dev -p 3500",
},
```
`-p` is the port flag. The default port is 3000, which is created by specifying:
"dev":"next dev"

Start up by running `yarn run local`
This enables access to this service on `https://localhost:3000 `

The selection of the backend call url with ENV specified is handled in `src/server.config.ts`

Notes:
- Nextjs v10 gets the ENV variable on build and saves it IN the build to be called. Hence, it is defined at the package.json build script: "build-dev": "ENV=dev next build" and "build-prod": "ENV=prod next build"