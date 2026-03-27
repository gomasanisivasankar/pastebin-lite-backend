## 🚀 How to run the app locally

### Prerequisites
- Node.js (v18 or later)
- MongoDB Atlas account (or a MongoDB connection URI)
- npm

---



### Clone the repository

git clone <backend-repo-url>
cd backend

### Install dependencies
npm install

### Create a .env file in the project root and add:
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/paste_db
BASE_URL=http://localhost:5000
TEST_MODE=0

### Start the server

npm run dev


