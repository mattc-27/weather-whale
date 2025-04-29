## Set Up Google Cloud Project

gcloud config set project weather-app-v2-389417
gcloud auth login
gcloud auth application-default set-quota-project weather-app-v2-389417

## Create & Configure Service Account

Create service account:

gcloud iam service-accounts create docker-deployer \
 --display-name="Docker Deployer"

Assign IAM roles:

gcloud projects add-iam-policy-binding weather-app-v2-389417 \
--member="serviceAccount:docker-deployer@weather-app-v2-389417.iam.gserviceaccount.com" \
 --role="roles/run.admin"

gcloud projects add-iam-policy-binding weather-app-v2-389417 \
--member="serviceAccount:docker-deployer@weather-app-v2-389417.iam.gserviceaccount.com" \
--role="roles/storage.admin"

gcloud projects add-iam-policy-binding weather-app-v2-389417 \
--member="serviceAccount:docker-deployer@weather-app-v2-389417.iam.gserviceaccount.com" \
--role="roles/iam.serviceAccountUser"

- Generate key file:
  gcloud iam service-accounts keys create key.json \
   --iam-account=docker-deployer@weather-app-v2-389417.iam.gserviceaccount.com

gcloud artifacts repositories create weather-whale-repo \
 --repository-format=docker \
 --location=us-central1 \
 --description="Docker repo for Weather Whale"

gcloud projects add-iam-policy-binding weather-app-v2-389417 \
--member="serviceAccount:docker-deployer@weather-app-v2-389417.iam.gserviceaccount.com" \
 --role="roles/artifactregistry.reader"

## Local build

docker build -t weather-whale .

docker run -p 8080:8080 weather-whale

docker build -t weather-whale .

docker run -p 8080:8080 weather-whale

Cloud build (Artifact Registry):

Authenticate:

- gcloud auth configure-docker

## Build and push using buildx:

docker buildx build \
--platform linux/amd64 \
--tag us-central1-docker.pkg.dev/weather-app-v2-389417/your-repo/image-name:tag \
--push .

docker buildx build --no-cache --platform linux/amd64 \
-t us-central1-docker.pkg.dev/weather-app-v2-389417/weather-whale-repo/weather-whale \
--push .

---

docker buildx build --no-cache --platform linux/amd64 \
-t us-central1-docker.pkg.dev/weather-app-v2-389417/weather-app-v2-389417/weather-whale-repo/weather-whale \
--push .

---

## Deploy to Cloud Run

gcloud run deploy weather-whale \
 --image us-central1-docker.pkg.dev/weather-app-v2-389417/weather-whale-repo/weather-whale \
 --platform managed \
 --region us-central1 \
 --allow-unauthenticated \
 --set-env-vars="WEATHER_API_KEY=2957b6bebdac477e89c204130240101,IQAIR_API_KEY=94d13397-d3ae-4965-a371-a0c723c895d8"

    "dependencies": {
    "body-parser": "^2.2.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "node-fetch": "^3.3.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.5.0",
    "vite": "^6.2.6"

},

npm install @types/react @types/react-dom @vitejs/plugin-react @vitejs/plugin-react-refresh --save-dev

npm install cors nodemon vite react react-dom react-router-dom node-fetch express dotenv cookie-parser body-parser react-icons nodemon react-ga4 react-hot-toast
