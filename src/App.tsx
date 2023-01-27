import { useState, useEffect } from "react";

function getAutoCompleteResults(
  query: string,
  signal?: AbortSignal
): Promise<string[]> {
  const fruits = [
    "Apple",
    "Watermelon",
    "Orange",
    "Pear",
    "Cherry",
    "Strawberry",
    "Nectarine",
    "Grape",
    "Mango",
    "Blueberry",
    "Pomegranate",
    "Carambola",
    "starfruit",
    "Plum",
    "Banana",
    "Raspberry",
    "Mandarin",
    "Jackfruit",
    "Papaya",
    "Kiwi",
    "Pineapple",
    "Lime",
    "Lemon",
    "Apricot",
    "Grapefruit",
    "Melon",
    "Coconut",
    "Avocado",
    "Peach",
  ];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal?.aborted) {
        reject(signal.reason);
      }
      resolve(
        fruits.filter((fruit) =>
          fruit.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, Math.random() * 1000);
  });
}

function useDebounceValue(value: string, time = 250) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value);
    }, time);
    return () => {
      clearTimeout(timeOut);
    };
  }, [value, time]);
  return debounceValue;
}

export function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceQuery = useDebounceValue(query);
  // const controller = new AbortController();

  {
    // using Signals
    /*
    useEffect(() => {
    const signal = controller.signal;
    (async () => {
      setSuggestions([]);
      if (debounceQuery.length > 0) {
        console.log(debounceQuery);
        const data = await getAutoCompleteResults(debounceQuery, signal);
        setSuggestions(data);
      }
    })();
    return () => controller.abort("Cancel the Request");
  }, [debounceQuery]);
     */
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      setSuggestions([]);
      if (debounceQuery.length > 0) {
        console.log(debounceQuery);
        const data = await getAutoCompleteResults(debounceQuery);
        if (!ignore) {
          setSuggestions(data);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [debounceQuery]);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-900">
      <input
        className="mt-24 mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="text-gray-200 flex flex-col gap-2 items-start">
        {suggestions.map((suggestion) => (
          <div key={suggestion}>{suggestion}</div>
        ))}
      </div>
    </div>
  );
}
