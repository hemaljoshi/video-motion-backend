# Video Motion Backend 

## Introduction

This is a ``Video Motion Backend`` project that covers multiple functionalities 
and also combines the tweet functionality from twitter into it. Find more about his project in the documentaion below.

## Important links

| Content            | Link                                                                        |
| -------------------| ----------------------------------------------------------------------------|
| API Documentation  | [click here](https://nodejs-production-5890.up.railway.app/api/v1/api-docs/#/)    |
| Model              | [click here ](https://app.eraser.io/workspace/5rEOIdzHZbOyC4S8lsTu?origin=share)         |

## Features

### User Management:

- Registration, Login, Logout, Change password
- Profile management (avatar, cover image, details)
- Watch history tracking

### Video Management:

- Video upload and publishing
- Get all videos with pagination
- Increase view count
- Video details update (title, description, thumbnail)
- Visibility control (publish/unpublish)
- Add and remove video from history with position
- Delete video

### Tweet Management:

- Tweet creation and publishing
- Viewing user tweets
- Updating and deleting tweets

### Subscription Management:

- Subscribing to channels
- Viewing subscriber and subscribed channel lists

### Playlist Management:

- Creating, updating, and deleting playlists
- Adding and removing videos from playlists
- Viewing user playlists

### Like Management:

- Liking and unliking videos, comments, and tweets
- Like counts for tweet comment and videos
- Viewing liked videos

### Comment Management:

- Adding, updating, and deleting comments on videos
- Get comments from videoId

### Dashboard:

- Viewing channel statistics (views, subscribers, videos, likes)
- Accessing uploaded videos

### Health Check:

- Endpoint to verify the backend's health

## Technologies Used

- Node.js 
- Express.js
- MongoDB
- Cloudinary (must have an account)

## Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/joshihemal/video-motion-backend.git
    ```

2. **Install dependencies:**

    ```bash
    cd video-motion-backend
    npm install
    ```

3. **Set up environment variables:**
    Create a .env in root of project and fill in the required values in the .env file using .env.sample file

4. **Start the server:**

    ```bash
    npm run dev
    ```

## Contributing

If you wish to contribute to this project, please feel free to contribute.