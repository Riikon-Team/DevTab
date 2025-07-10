import React, { useRef, useState, useEffect } from "react";
import "./SeachBar.css";
import SearchIcon from "@mui/icons-material/Search";
import EngineSelect from "./EngineSelect";
import { SEARCH_ENGINES, PROXY } from "../../constants/SearchEngine";
import axios from "axios";
import { useSearchSettings } from "../../hooks/useSettings";

const fetchSuggestions = async (query: string, engineIdx: number): Promise<string[]> => {
  if (!query) return [];
  try {
    const res = await axios.get(
      `${PROXY}${encodeURIComponent(SEARCH_ENGINES[engineIdx].acUrl + query)}`
    );
    return (res.data[1] as string[]).slice(0, 10);
  } catch {
    return [];
  }
};

const DEBOUNCE_DELAY = 350;

const SearchBar: React.FC = () => {
  const { searchSettings } = useSearchSettings();
  console.log("searchSettings", searchSettings);
  const [engineIdx, setEngineIdx] = useState(searchSettings?.defaultEngine ?? 0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query, engineIdx).then((sugs) => {
          if (!ignore) {
            setSuggestions(sugs);
            setIsLoading(false);
          }
        });
      }, DEBOUNCE_DELAY) as unknown as NodeJS.Timeout;
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
    return () => {
      ignore = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, engineIdx]);

  // Luôn đồng bộ engineIdx với searchSettings.defaultEngine nếu thay đổi
  useEffect(() => {
    if (
      typeof searchSettings?.defaultEngine === 'number' &&
      searchSettings.defaultEngine !== engineIdx
    ) {
      setEngineIdx(searchSettings.defaultEngine);
    }
  }, [searchSettings?.defaultEngine]);

  const handleSearch = (q?: string) => {
    const searchQuery = q ?? query;
    if (!searchQuery) return;
    const url = SEARCH_ENGINES[engineIdx].searchUrl + encodeURIComponent(searchQuery);
    window.open(url, "_self");
    setShowSuggestions(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setHighlightIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightIdx((idx) => Math.min(idx + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightIdx((idx) => Math.max(idx - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIdx >= 0 && suggestions[highlightIdx]) {
        setQuery(suggestions[highlightIdx]);
        handleSearch(suggestions[highlightIdx]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    handleSearch(s);
  };

  if (!searchSettings?.enable) {
    return null;
  }

  return (
    <div
      className={`searchbar-container ${
        searchSettings?.backgroundTransparent ? "transparent" : ""
      }`}
    >
      {/* Left: Engine select */}
      <div className="searchbar-engine">
        <EngineSelect engines={SEARCH_ENGINES} value={engineIdx} onChange={setEngineIdx} />
      </div>
      {/* Center: Input */}
      <div className="searchbar-input-wrap">
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder={`Search with ${SEARCH_ENGINES[engineIdx].name}...`}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="searchbar-suggestions">
            {suggestions.map((s, idx) => (
              <li
                key={s}
                className={highlightIdx === idx ? "active" : ""}
                onMouseDown={() => handleSuggestionClick(s)}
                onMouseEnter={() => setHighlightIdx(idx)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="searchbar-btn" onClick={() => handleSearch()}>
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
