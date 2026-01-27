function Profile() {

  const handleLogout = () => {
    window.location.href =
      "https://musicmind-backend.onrender.com/auth/logout";
  };

  return (
    <div>
      <h2>Profile</h2>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          backgroundColor: "#e53935",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
