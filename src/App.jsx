import { useState, useEffect } from "react";
import "./styles/main.scss";

import Table from "./components/Table";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Asynchronous function to fetch data from the API, no axios :(
  const fetchData = async () => {
    try {
      const response = await fetch("https://hiring.wdev.sk/fe-data");
      if (!response.ok) {
        throw new Error("Chyba pri načítaní dát");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="app">Načítavam dáta...</div>;
  if (error) return <div className="app">Chyba: {error}</div>;

  return (
    <div className="app">
      <h1>Tabuľka predajnosti</h1>
      {data.length > 0 && <Table data={data} />}
    </div>
  );
}

export default App;
