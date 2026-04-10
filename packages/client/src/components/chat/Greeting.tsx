import { SiGooglegemini } from "react-icons/si";

const Greeting = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 mt-20">
      <SiGooglegemini size={48} className="mb-4 text-red-400" />
      <h2 className="text-2xl font-semibold mb-2">Hi, Basir </h2>
      <p>How I can help you?</p>
    </div>
  );
};

export default Greeting;
