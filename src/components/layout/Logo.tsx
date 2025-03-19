
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/lovable-uploads/7a73a304-1c22-42bc-bdb2-a1c2dc214dde.png"
        alt="uMkhonto Wesizwe"
        className="h-10 w-10 rounded-full object-contain"
      />
    </Link>
  );
};

export default Logo;
