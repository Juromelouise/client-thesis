import {
  Navbar,
  NavbarBrand,
  Drawer,
  DrawerContent,
  DrawerHeader,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  HiMenu,
  HiOutlineUserCircle,
  HiOutlineLogin,
  HiOutlineLogout,
  HiHome,
  HiInformationCircle,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { FaMap } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, logout } from "../../utils/helpers";
import { toast } from "react-toastify";

export default function Header() {
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setUser(getUser());
    updateUser();
    window.addEventListener("user-logged-in", updateUser);
    return () => window.removeEventListener("user-logged-in", updateUser);
  }, []);

  useEffect(() => {
    const handleUserLoggedOut = () => setUser(null);
    window.addEventListener("user-logged-out", handleUserLoggedOut);
    return () => window.removeEventListener("user-logged-out", handleUserLoggedOut);
  }, []);

  const handleLogout = () => {
    logout(() => {
      window.dispatchEvent(new Event("user-logged-out"));
      navigate("/login");
      toast.success("Logged out successfully");
    });
  };

  return (
    <>
      <Navbar
        className="fixed top-0 left-0 w-full h-16 px-0 shadow bg-white z-50 border-b border-gray-200"
        maxWidth="fluid"
      >
        {/* Drawer for mobile */}
        <Drawer isOpen={isOpen} size="xs" onClose={onClose}>
          <DrawerContent>
            <div className="flex flex-col gap-4 p-4">
              <DrawerHeader className="text-lg font-semibold">
                MENU
              </DrawerHeader>
              {user &&
                user !== false &&
                (user.role === "admin" || user.role === "superadmin") && (
                  <Button
                    color="primary"
                    variant="light"
                    className="w-full text-left"
                    onPress={() => {
                      navigate("/dashboard");
                      onClose();
                    }}
                  >
                    <HiOutlineViewGrid className="inline mr-2" />
                    Dashboard
                  </Button>
                )}
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/fyp");
                  onClose();
                }}
              >
                <HiHome className="inline mr-2" />
                Home
              </Button>
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/street-legends");
                  onClose();
                }}
              >
                <FaMap className="inline mr-2" />
                Street Legends
              </Button>
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/about");
                  onClose();
                }}
              >
                <HiInformationCircle className="inline mr-2" />
                About
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <div className="flex items-center justify-between w-full h-16 px-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <Link to="/fyp">
              <NavbarBrand>
                {/* Updated: Use provided logo image */}
                <span className="flex items-center select-none">
                  <img
                    src="/bovo_logo.png"
                    alt="BOVO App Logo"
                    className="w-10 h-10 mr-2 rounded-full bg-white border border-gray-200 shadow"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="text-2xl font-extrabold tracking-tight text-gray-900 ml-1"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    BOVO
                  </span>
                </span>
              </NavbarBrand>
            </Link>
          </div>
          {/* Center: Navigation (Facebook-like icons) */}
          <div className="hidden md:flex items-center gap-8">
            {user &&
              user !== false &&
              (user.role === "admin" || user.role === "superadmin") && (
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Dashboard"
                  onPress={() => navigate("/dashboard")}
                  className="rounded-full hover:bg-blue-100"
                >
                  <HiOutlineViewGrid className="text-2xl text-blue-600" />
                </Button>
              )}
            <Button
              isIconOnly
              variant="light"
              aria-label="Home"
              onPress={() => navigate("/fyp")}
              className="rounded-full hover:bg-blue-100"
            >
              <HiHome className="text-2xl text-blue-600" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              aria-label="FYP"
              onPress={() => navigate("/street-legends")}
              className="rounded-full hover:bg-blue-100"
            >
              <FaMap className="text-2xl text-blue-600" />
              {/* Changed icon */}
            </Button>
            <Button
              isIconOnly
              variant="light"
              aria-label="About"
              onPress={() => navigate("/about")}
              className="rounded-full hover:bg-blue-100"
            >
              <HiInformationCircle className="text-2xl text-blue-600" />
            </Button>
          </div>

          {/* Right: User/Profile/Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Button
                isIconOnly
                variant="light"
                aria-label="Menu"
                onPress={onOpen}
                className="rounded-full"
              >
                <HiMenu className="text-2xl text-blue-600" />
              </Button>
            </div>
            {/* User/Profile */}
            {user && user !== false ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" className="rounded-full">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <HiOutlineUserCircle className="text-2xl text-blue-600" />
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onPress={() => navigate("/profile")}>
                    <div className="flex items-center gap-2">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <HiOutlineUserCircle className="text-2xl text-blue-600" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem onPress={handleLogout}>
                    <HiOutlineLogout className="text-xl mr-2" />
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                color="primary"
                variant="solid"
                className="flex items-center gap-2 text-white transition-colors duration-300 hover:bg-blue-600 rounded-full"
                onPress={() => navigate("/login")}
              >
                <HiOutlineLogin className="text-xl" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </Navbar>
      {/* Spacer to prevent content from being hidden behind the navbar */}
      <div className="h-16"></div>
    </>
  );
}
