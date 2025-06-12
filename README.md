# Home

This repository contains the [BloomBuddy website](https://cscd488group3-BloomBuddy.netlify.app/). Developed by Ethan Crawford, Jared Diaz, and Daniel Montes.

## Documentation for future development of forks of this project

### Requirements

- Node.js
  - All other requirements are (should be) handled by the node package manager:
  - After verifying your Node.js installation, run `npm run build` to build the project from the package.

#### Accounts

In order to continue development on a fork of our project, you will need to create accounts with the following services:

- Netlify (deployment & hosting)
- Cloudflare (database integration)
- Cloudinary (image hosting)
- Resend (email)
- Openweather (weather and geolocation API)
- Perenual (plant API)

Each of these services provide environment variables and/or API endpoints. In each case, you will need to replace our endpoints with the endpoints they give you, and create your own file with your environment variables.

### APIs

The Perenual plant API used in this project has paid services but the free plan was utilized here, keep in mind that the free plan limits developers to only 100 API requests per day. Some of the information available in the free plan includes:

- Access to 3000 plant species data
- Recommendations on plant watering cycles
- Sunlight requirements
- Pruning recommendations
- Plant care guides

This information is sufficient for most basic use cases. However, for more advanced implementations, developers could pay for Perenual's "premium" or "supreme" services. The paid version provides even more detailed information about each plant including access to the API's plant hardiness map. This map can help determine whether a specific plant species is suitable for growth in a given geographic location, which would significantly enhance this project's ability to make more personalized and efficient plant recommendations.

The OpenWeather API utilized in this project is also available for free to developers, as long as the project does not exceed 1,000 API calls per day. It also includes paid versions, but just like the plant API, the free plan is sufficient for most cases. The weather information provided by the OpenWeather API includes:

- Current weather and forecasts
  - 1 hour, minute forecast
  - hourly forecast for 48 hours
  - daily forecasts for 8 days

- weather alerts
- Historical data (46+ years back)
- UV index (strength of sun ultraviolet radiation)
- Dew point (the point where water droplets begin to condence)

The information provided by the weather API can be very beneficial to users to help them plan their gardening routines as they see fit, further increasing the project's efficiency. The paid versions of this API include extended weather forecasting, such as instead of a daily forecast of 8 days, developers would receive a daily forecast of 16 days. Other services such as air pollution and weather maps become available if the developers wish to invest in this API. Keep in mind that most of these services only become available with specific subscription plans. 

### Tech Stack

Astro styled with Tailwind, DaisyUI, and custom CSS, deployed in Netlify

### Integrations

- Cloudflare D1 SQLite Database
- Cloudflare Worker
- Cloudinary
- Resend

### Prerequisites for a future dev team

You will need to build a `.env` file with the following fields:

- `API_KEY` - openweather api key
- `DB_KEY` - cloudflare D1 database id
- `USR_DB` - cloudflare worker security key (you make this key)
- `USR_DB_W` - cloudflare worker security key (you make this key)
- `USR_DB_W_ADMIN` - cloudflare worker security key (you make this key)
- `USR_SESSION` - cloudflare worker security key (you make this key)
- `USR_POST` - cloudflare worker security key (you make this key)
- `PERENUAL_KEY` - perenual plant api

#### Cloudflare (in your codebase)

In your codebase, you will need to build a `wrangler.toml` file. This will contain the
configuration for your cloudflare database worker:

```[TOML]
# wrangler.toml (wrangler v3.88.0^)
name = "" # the name of your database
main = "src/workers/d1-api.js" # the location of the api in our repository
compatibility_date = "2024-02-26"
workers_dev = true
preview_urls = false

[observability.logs]
enabled = true

[vars] # the same as your .env file
DB_KEY="" # insert your database id
USR_DB="" # insert your key
USR_DB_W="" # insert your key
USR_DB_W_ADMIN="" # insert your key
USR_SESSION="" # insert your key
USR_POST="" # insert your key

[[d1_databases]]
binding = "DB" # this is the binding we use in our codebase
database_id = "" # the same as DB_KEY
database_name = "user-info" # name of the database
```

After making your `wrangler.toml`, run `npx wrangler deploy` (this may not work until the database is live. Additionally, it will only work if you are logged in with `npx wrangler login`). You may also need to run:

- `npm install -g npx` if you do not have npx installed globally,

The installation of wrangler should be handled by node. To verify:

- `npx wrangler --version`
- `npx wrangler version`
- `npx wrangler -v`

To install:

- `npm i -D wrangler@latest`

Check if you are logged in:

- `npm wrangler whoami`.

#### Cloudflare Dashboard

In Cloudflare's dashboard, you will need to build a D1 database using SQLite. This can be done using the following script in Cloudflare's terminal:

```[SQLite]
DROP TABLE IF EXISTS user_session;
DROP TABLE IF EXISTS user_priv;
DROP TABLE IF EXISTS group_post;
DROP TABLE IF EXISTS group_member;
DROP TABLE IF EXISTS group_g;
DROP TABLE IF EXISTS reaction;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS info;
DROP TABLE IF EXISTS admin;
CREATE TABLE admin ( 
    uid VARCHAR(255) PRIMARY KEY, 
    email VARCHAR(255) NOT NULL, 
    hashpass VARCHAR(255) NOT NULL
);
CREATE TABLE info ( 
    uid VARCHAR(255) PRIMARY KEY,  
    fname VARCHAR(255) NOT NULL, 
    lname VARCHAR(255) NOT NULL, 
    dob DATETIME NOT NULL,
    doj DATETIME NOT NULL,
    FOREIGN KEY (uid) REFERENCES admin(uid) ON DELETE CASCADE
);
CREATE TABLE post ( 
    pid VARCHAR(64) PRIMARY KEY, 
    caption VARCHAR(255) NOT NULL, 
    url VARCHAR(255) NOT NULL, 
    uid VARCHAR(255) NOT NULL, 
    FOREIGN KEY (uid) REFERENCES admin(uid) ON DELETE CASCADE 
);
CREATE TABLE comment (
    cid VARCHAR(64) PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL,
    pid VARCHAR(64) NOT NULL,
    FOREIGN KEY (uid) REFERENCES admin (uid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES post(pid) ON DELETE CASCADE 
);
CREATE TABLE reaction ( 
    rid VARCHAR(64) PRIMARY KEY, 
    uid VARCHAR(255) NOT NULL, 
    pid VARCHAR(64) NOT NULL, 
    FOREIGN KEY (uid) 
    REFERENCES admin (uid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES post(pid) ON DELETE CASCADE
);
CREATE TABLE group_g (
    gid VARCHAR(64) PRIMARY KEY, 
    gname VARCHAR(255) NOT NULL, 
    priv int NOT NULL /* regulates the visibility of the group: 0 for ''PRIVATE'' (only creator has access) 1 for ''MOD_PRIVATE'' (only CREATOR and MODERATOR have access) 2 for ''PROTECTED'' (only CREATOR MODERATOR and MEMBER can access) 3 for ''PUBLIC'' (everybody can view, only CREATOR MODERATOR and MEMBER can post, comment, or react) */
);
CREATE TABLE group_member (
    gmid VARCHAR(255) PRIMARY KEY, /* gmid is primary key because there can be multiple users per group and users can be in multiple groups */
    uid VARCHAR(255) NOT NULL,  
    gid VARCHAR(64) NOT NULL, 
    role_g int NOT NULL, /* this will be 0 for ''CREATOR'', 1 for ''MODERATOR'', or 2 for ''MEMBER'' */ 
    priv int NOT NULL, /* regulates the visibility of the member of the group: 0 to inherit the group's privacy setting, 1 for ''PRIVATE'' */ 
    FOREIGN KEY (gid) REFERENCES group_g(gid) ON DELETE CASCADE, 
    FOREIGN KEY (uid) REFERENCES admin(uid) ON DELETE CASCADE
);
CREATE TABLE group_post ( /* this table stores the posts associated with a group */ 
    pid VARCHAR(64) PRIMARY KEY, /* pid is primary key because there is only one id per post, but there can me multiple posts per group */ 
    gid VARCHAR(64) NOT NULL, 
    FOREIGN KEY (gid) REFERENCES group_g(gid) ON DELETE CASCADE, 
    FOREIGN KEY (pid) REFERENCES post(pid) ON DELETE CASCADE 
);
CREATE TABLE user_priv (
    uid VARCHAR(255) PRIMARY KEY, 
    priv int, /* regulates the visibility of the user: 0 for ''PUBLIC'' 1 for ''PRIVATE'' */ FOREIGN KEY (uid) REFERENCES admin(uid) ON DELETE CASCADE
);
CREATE TABLE user_session ( 
    usid VARCHAR(255) NOT NULL PRIMARY KEY, 
    uid varchar(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (uid) REFERENCES admin(uid) ON DELETE CASCADE
);
```

After setting up the database, you can deploy your worker in Cloudflare's dashboard, or at the terminal using `npx wrangler deploy`. You will get an active deployment URL. You will need to replace all instances of our deployment URL with yours.

#### Netlify

In order for our `process.env` calls to work, environment variables also need to be stored in Netlify. These can be imported from the `.env` file or added manually.

## About

### Gardening Website

Our main purpose for creating this website is to assist individuals who would like
to start gardening but do not know where to begin, as well as those who already have a
garden and want to improve its quality and yield. We aim to make the website helpful by
providing easy access to helpful information and tips. It does not matter if someone is
starting from scratch, already has a garden, is a busy person, or manages crops—the
platform will help them find solutions easily and quickly.

### Features

In addition, our website will cater to diverse gardening needs. From specific tips
to tailored information based on location, climate, and more, users will be able to find
advice that suits their unique circumstances. Whether they have a small garden or a
larger space, the website will offer support regardless of their space, schedule, or
lifestyle. By incorporating these features, we hope users can help one another, learn
new things about gardening, and make the experience enjoyable and rewarding.

### Frameworks

Our website will be built using Astro and styled with Tailwind and DaisyUI. These frameworks allow for
fast, modular development. They are designed to handle repetitive structures and components, which will
allow our website to dynamically display gardening information that a user needs, as well as
user generated content for the greater community.
