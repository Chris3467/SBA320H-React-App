import { Link } from "react-router";

export default function Nav() {
  return (
    <div className="navbar">
      <Link to="/">
        <div>Home</div>
      </Link>
      <Link to="/Gaming">
        <div>Gaming</div>
      </Link>
      <Link to="/Movies">
        <div>Movies</div>
      </Link>
      <Link to="/Anime">
        <div>Anime</div>
      </Link>
    </div>
  );
}
