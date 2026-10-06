import { BrowserRouter, Routes, Route } from "react-router-dom";

import UsersPage from "../pages/UsersPage";
import PostsPage from "../pages/PostsPage";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<UsersPage />}/>
                <Route path="/posts/:userId" element={<PostsPage />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;