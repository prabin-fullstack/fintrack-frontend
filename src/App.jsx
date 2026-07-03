import { useState } from "react";
import Navbar from "./Components/Navbar";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const userName = (
    localStorage.getItem("username") || "AK"
    
  )
    

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        
        onLogout={handleLogout}
      />

      <AppRoutes setIsLoggedIn={setIsLoggedIn} />
    </>
  );
}

export default App;