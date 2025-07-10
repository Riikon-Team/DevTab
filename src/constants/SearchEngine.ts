export const PROXY = "https://simple-cors-anywhere.vercel.app/proxy?url=";
export const API_WINFO = "https://simple-cors-anywhere.vercel.app/winfo?url=";

export type SearchEngine = {
  name: string;
  icon: string; 
  searchUrl: string; 
  acUrl?: string;
};

export const SEARCH_ENGINES: SearchEngine[] = [
    {
        name: "Google",
        icon: "assets/img/search-engine/google.png",
        searchUrl: "https://www.google.com/search?q=",
        acUrl: "https://suggestqueries.google.com/complete/search?client=chrome&q="
    },
    {
        name: "Bing",
        icon: "assets/img/search-engine/bing.png",
        searchUrl: "https://www.bing.com/search?q=",
        acUrl: "https://api.bing.com/osjson.aspx?query="
    },
    {
        name: "DuckDuckGo",
        icon: "assets/img/search-engine/duckduckgo.png",
        searchUrl: "https://duckduckgo.com/?q=",
        acUrl: "https://duckduckgo.com/ac/?q="
    }
];


