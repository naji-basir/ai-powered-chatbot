import ChatBot from "./components/ChatBot";
import Sidebar from "./components/Sidebar";
import ThemeSwitcher from "./components/ThemeSwitcher";

const App = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <Sidebar />
      <div>
        <ThemeSwitcher />
        <ChatBot />
      </div>
    </div>
  );
};
export default App;
