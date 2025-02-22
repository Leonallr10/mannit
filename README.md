# Mannit AI Chatbot

Easily integrate Nia AI into your React project using its API.

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Leonallr10/mannit.git
cd mannit
```

### 2. Create an `.env` File

In the root directory, create a `.env` file and add the following environment variables:

```env
VITE_NIA_API_URL=https://api.mannit.ai/v2/query
VITE_NIA_API_KEY=your_api_key
```

You can generate your API key from the [API Keys](https://app.mannit.ai/api-keys) page.

### 3. Install Dependencies

```sh
npm install
```

### 4. Run the Project

```sh
npm run dev
```

## API Usage

Refer to the [API Documentation](https://docs.trynia.ai/api-reference/repositories/index-a-new-repository) for more details.

### 1. Index a New Repository

#### Endpoint:

```sh
POST https://api.mannit.ai/v2/repositories
```

#### Request Body Example:

```json
{
  "repository": "Leonallr10/mannit",
  "branch": "main"
}
```

### 2. Query Indexed Repositories

#### Endpoint:

```sh
POST https://api.mannit.ai/v2/query
```

#### Request Body Example:

```json
{
  "messages": [{ "role": "user", "content": "your query" }],
  "repositories": [{ "repository": "Leonallr10/mannit" }],
  "stream": false
}
```

## Project Structure

```
mannit/
├─ .env
├─ src/
│  ├─ api/
│  │  └─ niaApi.ts (Handles Mannit AI API integration)
│  ├─ components/
│  │  ├─ ChatInterface.tsx (User interface for the chatbot)
│  │  ├─ NavigationBar.tsx (Navigation bar component)
│  │  ├─ ProjectCreationModal.tsx (Modal for creating new projects)
│  │  └─ Sidebar.tsx (Sidebar navigation component)
│  ├─ main.tsx (Application entry point)
│  ├─ index.css (Global styles)
│  ├─ App.tsx (Main application component)
├─ public/ (Static assets)
├─ package.json (Project dependencies and scripts)
├─ vite.config.ts (Vite configuration file)
├─ tailwind.config.js (TailwindCSS configuration file)
└─ tsconfig.json (TypeScript configuration)
```

## Features

- AI-powered chatbot for intelligent querying
- Real-time streaming responses
- TailwindCSS for modern styling
- Vite for fast development and optimized builds

## License

This project is open-source under the MIT License.

---

For more details, check the [API Documentation](https://docs.mannit.ai/api-reference/query/query-indexed-repositories).

