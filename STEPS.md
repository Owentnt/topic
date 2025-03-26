# Next.js Project with Mapbox GL

This guide will walk you through the steps to install Mapbox GL in your Next.js project and add your Mapbox token.

## 1. Create a Mapbox Token

To use Mapbox in your project, you need to create an account and get an access token.

### Steps to create a Mapbox token:

1. **Sign Up / Log In:**
    - Go to [Mapbox](https://www.mapbox.com).
    - If you don’t have an account, click **Sign up** to create a new one.
    - If you already have an account, click **Log in**.

2. **Navigate to the Account Page:**
    - Once logged in, go to your **Account page** by clicking on your profile icon in the top-right corner and selecting **Account** from the dropdown.

3. **Generate an Access Token:**
    - Under the **Access tokens** section, you'll see your default public token.
    - You can either use this default token or create a new one by clicking the **Create a token** button.
    - Give your token a name (e.g., "Next.js Project Token") and select the permissions you need. The default permissions should be sufficient for most use cases.
    - After creating the token, copy it.

4. **Save the Token:**
    - Store your token in a secure place, as you'll need it to integrate Mapbox into your Next.js project.

## 2. Install Mapbox GL

First, install Mapbox GL in your project using the following command in your terminal (bash):

```bash
npm install mapbox-gl


