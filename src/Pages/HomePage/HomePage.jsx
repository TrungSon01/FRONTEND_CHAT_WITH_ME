import React, { useEffect, useState } from "react";
import ChatBox from "../../Components/ChatBox";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsersExceptMe } from "../../apis/userService";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/userSlice";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    // Kiểm tra localStorage xem có user không
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ parse lại từ JSON string
    if (storedUser) {
      getAllUsersExceptMe(storedUser.userid)
        .then((res) => {
          setUsers(res.data);
        })
        .catch(() => setUsers([]));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("USER");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <div>
          <div className="font-bold text-xl mb-2 text-gray-700">Chọn người để nhắn tin:</div>
          <div className="flex flex-wrap gap-2">
            {users.length === 0 && <div className="text-gray-400">Không có user nào khác</div>}
            {users.map((u) => (
              <button
                key={u.userid}
                onClick={() => setReceiver(u)}
                className={`px-4 py-2 rounded-full font-semibold transition border shadow-sm
                  ${receiver?.userid === u.userid ? "bg-blue-500 text-white" : "bg-white text-blue-600 hover:bg-blue-100"}
                `}
              >
                {u.username}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition"
        >
          Đăng xuất
        </button>
      </div>
      {receiver ? (
        <ChatBox receiver={receiver} />
      ) : (
        <div className="text-gray-500 text-lg font-medium mt-10">Hãy chọn một người để bắt đầu chat!</div>
      )}
    </div>
  );
}
