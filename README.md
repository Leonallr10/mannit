# Mannit AI Chatbot

This project integrates Mannit AI to query indexed repositories for AI-driven insights. It features a chat interface that allows users to interact with the AI using an API.

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Leonallr10/mannit.git
cd mannit
```

### 2. Create an `.env` File

In the root directory, create a `.env` file and add the following:

```env
VITE_NIA_API_URL=https://api.mannit.ai/v2/query
VITE_NIA_API_KEY=your_api_key
```

Generate your API key from [Mannit API Keys](https://app.mannit.ai/api-keys).

### 3. Install Dependencies

```sh
npm install
```

### 4. Run the Project

```sh
npm run dev
```

## API Usage

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
│  │  └─ niaApi.ts (Integration with Mannit AI API)
│  ├─ components/
│  │  ├─ ChatInterface.tsx (Chatbot interface for user interaction)
│  │  ├─ NavigationBar.tsx (Navigation bar component)
│  │  ├─ ProjectCreationModal.tsx (Interface for creating new projects)
│  │  └─ Sidebar.tsx (Sidebar component for navigation)
│  ├─ main.tsx (Entry point for the application)
│  ├─ index.css (Global styles)
│  ├─ App.tsx (Main application component)
├─ public/ (Static assets)
├─ package.json (Project dependencies and scripts)
├─ vite.config.ts (Vite configuration file)
├─ tailwind.config.js (TailwindCSS configuration file)
└─ tsconfig.json (TypeScript configuration)
```

## Features

- AI-powered chatbot for querying insights
- Real-time streaming responses
- TailwindCSS for styling
- Vite for fast development and efficient builds

## License

This project is open-source under the MIT License.

---

For more details, check the [API Documentation](https://docs.mannit.ai/api-reference/query/query-indexed-repositories).

