import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginRegisterPage/LoginPage";
import RegisterPage from "./Pages/LoginRegisterPage/RegisterPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserAction } from "./redux/userSlice";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      dispatch(setUserAction(user));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
