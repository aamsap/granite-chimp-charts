import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-lg border-b border-border z-50 navbar">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={logo} alt="Chimp Chart" className="h-10 w-10" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Chimp Chart
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-foreground/70"
              }`}
          >
            Home
          </Link>
          <Link
            to="/how-to-use"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/how-to-use") ? "text-primary" : "text-foreground/70"
              }`}
          >
            How to Use
          </Link>
          <Link
            to="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/pricing") ? "text-primary" : "text-foreground/70"
              }`}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary" : "text-foreground/70"
              }`}
          >
            About
          </Link>
        </div>

        <Link to="/chimp-chart">
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            Try Chimp Chart
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
