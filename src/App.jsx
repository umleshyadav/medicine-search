import { Link, Route, Routes } from "react-router-dom";
import Search from "./Search.jsx";
import Detail from "./Detail.jsx";

export default function App() {
  return (
    <>
      <header className="header">
        <Link to="/">💊 Medicine Search</Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/medicine/:id" element={<Detail />} />
          <Route
            path="*"
            element={
              <p className="state">
                Page not found. <Link to="/">Go to search</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </>
  );
}
