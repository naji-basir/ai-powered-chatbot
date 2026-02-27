import { useEffect, useState } from "react";
import { MdLightMode } from "react-icons/md";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { RiMoonClearLine } from "react-icons/ri";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("system"); // 'light', 'dark', 'system'

  // Apply theme to document
  const applyTheme = (mode: string) => {
    const root = document.documentElement;

    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", mode === "dark");
    }

    root.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  };

  // Initialize theme from localStorage or system
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: { matches: any }) => {
      if (localStorage.getItem("theme") === "system") {
        const root = document.documentElement;
        root.classList.toggle("dark", e.matches);
      }
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Handle button click
  const handleChange = (mode: string) => {
    setTheme(mode);
    applyTheme(mode);
  };

  const buttonClass = (active: boolean) =>
    `p-2 rounded transition-colors duration-200 rounded-full ${
      active ? "bg-gray-400 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-800"
    } hover:bg-gray-400 dark:hover:bg-gray-600`;

  return (
    <div className=" absolute top-2 scale-65 bg-gray-100 w-32 h-12 ring-2 ring-slate-500 dark:bg-gray-800 rounded-4xl flex gap-1 items-center justify-center">
      <button
        className={buttonClass(theme === "system")}
        onClick={() => handleChange("system")}
      >
        <HiMiniComputerDesktop size={20} />
      </button>
      <button
        className={buttonClass(theme === "light")}
        onClick={() => handleChange("light")}
      >
        <MdLightMode size={20} />
      </button>
      <button
        className={buttonClass(theme === "dark")}
        onClick={() => handleChange("dark")}
      >
        <RiMoonClearLine size={20} />
      </button>
    </div>
  );
}
