# **App Name**: MoodJournal

## Core Features:

- Login/Signup: Allow users to create an account and log in using email and password. Store user credentials in localStorage. Redirect to the Dashboard upon successful login.
- Logout: Implement a logout feature that clears user data from localStorage and redirects the user to the login page.
- Dashboard: Display a welcome message with the user's email, a 'Log Today's Mood' button, quick stats (total moods logged, last logged mood), and a list of previously logged moods.
- Mood Logging: Provide a form with a dropdown/select for mood type (happy, sad, angry, stressed, excited) and an optional text input for notes. Save the mood with a timestamp to localStorage, then return to the Dashboard.
- Profile Page: Display user information (email only) and the number of moods logged. Include an option to edit the user's name (stored in localStorage).
- Mood Trend Analysis: Use a tool powered by generative AI to summarize overall trends in user mood based on mood logs and text notes.

## Style Guidelines:

- Primary color: Light teal (#99D9EA) to promote calmness and balance.
- Background color: Off-white (#F5F5F5) for a clean and minimal aesthetic.
- Accent color: Pale green (#B8E4A0) for interactive elements like buttons.
- Font: 'PT Sans', a sans-serif, for both body and headline as it combines a modern look and a little warmth or personality; suitable for headlines or body text.
- Use centered forms, cards, and buttons for a simple and balanced layout.
- Subtle transitions and hover effects for a smooth user experience.