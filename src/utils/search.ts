import { PROXY, SUGGESTION_ENGINE } from '../constants/main';

export const fetchSearchSuggestions = async (query: string): Promise<string[]> => {
  const response = await fetch(
    PROXY + encodeURIComponent(
        `${SUGGESTION_ENGINE.GOOGLE}${query}`));
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data[1].slice(0, 5);
};

export const randomBackground = (backgrounds: string[]): string => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};