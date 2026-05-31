export const THEME_STORAGE_KEY = "theme";

export const THEME_INIT_SCRIPT = `(function(){try{var e=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system",m=window.matchMedia("(prefers-color-scheme: dark)").matches,a=t==="dark"||t==="system"&&m?"dark":"light";e.classList.toggle("dark",a==="dark"),e.style.colorScheme=a}catch(e){}})();`;
