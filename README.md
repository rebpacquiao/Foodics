Responsive Dashboard with API Integration

This project creates a responsive dashboard layout with the following components:

Header: A fixed top header containing a title and a user avatar.
Sidebar: A collapsible sidebar with navigation links.
Main Content Area: A section displaying fetched data from an API.
Modal: A modal that opens when a post's title is clicked, displaying more details about the post, including comments.
Dark Mode Toggle: A toggle to switch between light and dark themes using Tailwind CSS's built-in dark mode utilities.


Prerequisites
Node.js and npm installed

Installation
git clone <repository-url>
cd project name
npm install
npm run serve

Additional Notes and Assumptions
The project API endpoint for fetching posts is /posts and for fetching comments is /comments. You may need to adjust the endpoints in the code if they are different.
The project uses Tailwind CSS for styling. Ensure you have Tailwind CSS configured correctly in your project.
The project structure and components can be further customized based on your specific requirements.

Usage
Navigation: Use the sidebar navigation links to navigate between different sections of the dashboard.
Post Details: Click on a post's title to open a modal displaying more details.
Dark Mode: Toggle the dark mode switch to switch between light and dark themes.

Demo link--> https://foodic-demo.netlify.app/
