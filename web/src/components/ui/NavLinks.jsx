import { NavLink } from "react-router-dom";
import { navLinks } from "../data/navigation";

const NavLinks = ({className=""}) => {
  return (
            <>
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `px-1.5 py-1 font-medium  border-b-2 transition-all duration-200 ${className}
                  ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-primary"
                  }
                `
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </>
  )
}

export default NavLinks