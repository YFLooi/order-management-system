## Running this repo

Install packages by running `yarn install`

To change the localhost port, go to package.json and set the following:
"scripts": {
"dev": "next dev -p 3500",
},
"-p" is the port flag. The default port is 3000, which is created by specifying:
"dev":"next dev"

You need a ".env" file in the root folder. It should contain the following:

```
PORT=3500
```

You'll also need the keys for this repo. Get them from your team members

Depending on your target backend env, start up by running the following, which starts a
script in package.json:

1.  `yarn run local` : Run a local server with the backend connected to a localhost:16900 backend
2.  `yarn run dev` : Run a local server with the backend connected to a be.dev.bjak.sg backend
3.  `yarn run prod` : Run a local server with the backend connected to be.bjak.sg backend

The selection of the backend call url with ENV specified in these scripts is handled in `server.config.ts`

## Deploying new images

This app is set up to be hosted in gcp under the project "bjak-sg-backend" (id: bjak-sg-backend)

1.  Deployment starts by setting the kubectl context to sg-dev (gke bjak-sg-backend asia-southeast1-a sg-dev)

2.  Declare a PORT env variable for your terminal. This is the same set under EXPOSE in Dockerfile.production: `export PORT=3500`

3.  Run the push-dev-latest.sh script from root to push this project to the Container Registry "bjak-sg-backend":
    `./scripts/push-dev-latest.sh`. Note the (tagName) in yellow at the end of the deployment.
    If the gcloud error "OPENSSL_1_1_1' not found" appears, declare the `CLOUDSDK_PYTHON` env variable then re-run the .sh script:
    `export CLOUDSDK_PYTHON=python2`

4.  Deploy the container to the Kubernetes cluster by running:`./scripts/web-dev-rolling-update.sh (tagName)`
    Note: If deploying to a new cluster, run this script instead: `./scripts/web-dev-restart.sh`

5.  Check if it is running fine on dev by visiting "web.dev.bjak.sg". The deployment tag can also be found on the container image description listed in Google Container Registry.

6.  Run `kubectl get pods -n dev` and check if the pod is deployed. If not, and you did the web-dev-rolling-update script, odds are the wrong tag was used. In this case, use the deployment tag "latest"

If everything works as expected, repeat the steps above but for prod:

1.  Deployment starts by setting the kubectl context to sg-prod (gke bjak-sg-backend asia-southeast1-a sg-prod)

2.  Declare a PORT env variable for your terminal. This is the same set under EXPOSE in Dockerfile.production: `export PORT=3500`

3.  Run the push-prod-latest.sh script from root to push this project to the Container Registry "bjak-sg-backend":
    `./scripts/push-prod-latest.sh`. Note the (tagName) in yellow at the end of the deployment.
    If the gcloud error "OPENSSL_1_1_1' not found" appears, declare the `CLOUDSDK_PYTHON` env variable then re-run the .sh script:
    `export CLOUDSDK_PYTHON=python2`

4.  Deploy the container to the Kubernetes cluster by running:`./scripts/web-prod-rolling-update.sh (tagName)`
    Note: If deploying to a new cluster, run this script instead: `./scripts/web-prod-restart.sh`

5.  Check if it is running fine on dev by visiting "web.bjak.sg". The deployment tag can also be found on the container image description listed in Google Container Registry.

6.  Run `kubectl get pods -n prod` and check if the pod is deployed. If not, and you did the web-dev-rolling-update script, odds are the wrong tag was used. In this case, use the deployment tag "latest"

Notes:

- Nextjs v10 gets the ENV variable on build and saves it IN the build to be called. Hence, it is defined at the package.json build script: "build-dev": "ENV=dev next build" and "build-prod": "ENV=prod next build",

## SEO

SEO: Using next-seo
Done only with main landing page used in index.js
SEO configurations in next-seo.config.js

## Heatmap with Hotjar and ad tracking with Google Ads and Facebook Pixel

Done by inserting scripts as HTML dangerously in the top level HEAD tag of AppLayout
with ImportScripts.tsx. Scripts added for Facebook Pixel, Google Ads, and Hotjar

Google Ads are tracked by calling the gtag function to pass in events to be tracked.
These tracking events are fired by a globally available `gtag` function in globals.d.ts

View results of these tracking data by going [here](https://analytics.google.com/). Look under **Behavior** section for related data.

For both Google Ads and Facebook Pixel, we collect the information they put on our
site to store in the policy doc upon form submit at quote-req.

- From Google Ads: GClid
- From Facebook Pixel: fbp, fbc, and client IP address
