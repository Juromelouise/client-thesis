import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
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
  HiOutlineChevronUp,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, logout } from "../../utils/helpers";

export default function Header() {
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const navigate = useNavigate();

  const handleOpen = () => {
    onOpen();
  };

  useEffect(() => {
    const updateUser = () => setUser(getUser());
    updateUser();
    window.addEventListener("user-logged-in", updateUser);
    return () => window.removeEventListener("user-logged-in", updateUser);
  }, []);

  const handleLogout = () => {
    logout(() => {
      navigate("/login");
      window.location.reload();
    });
  };

  const toggleHeaderVisibility = () => {
    setIsHeaderVisible(!isHeaderVisible);
  };

  return (
    <>
      <Navbar
        className={`fixed top-0 left-0 w-full px-4 shadow-md bg-white z-50 transition-all duration-500 ${
          isHeaderVisible ? "h-16" : "h-8"
        }`}
        maxWidth="fluid"
      >
        <Drawer isOpen={isOpen} size="xs" onClose={onClose}>
          <DrawerContent>
            <div className="flex flex-col gap-4 p-4">
              <DrawerHeader className="text-lg font-semibold">
                MENU
              </DrawerHeader>
              {user && user !== false && user.role === "admin" ? (
                <Button
                  color="primary"
                  variant="light"
                  className="w-full text-left"
                  onPress={() => {
                    navigate("/dashboard");
                    onClose();
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <></>
              )}
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/about");
                  onClose();
                }}
              >
                About
              </Button>
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/");
                  onClose();
                }}
              >
                Home
              </Button>
              <Button
                color="primary"
                variant="light"
                className="w-full text-left"
                onPress={() => {
                  navigate("/fyp");
                  onClose();
                }}
              >
                FYP
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex items-center justify-between w-full">
          {/* Brand */}
          <Link to="/">
            <NavbarBrand>
              <span
                className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ${
                  isHeaderVisible ? "" : "text-sm"
                }`}
              >
                {isHeaderVisible ? "BOVO" : ""}
              </span>
            </NavbarBrand>
          </Link>
          {/* Spacer */}
          {isHeaderVisible && (
            <NavbarContent justify="end" className="gap-4">
              {/* Menu Icon */}
              <NavbarItem>
                <HiMenu
                  className="text-2xl text-gray-600 cursor-pointer"
                  onClick={handleOpen}
                />
              </NavbarItem>

              {/* User Icon */}
              {user && user !== false ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      variant="light"
                      className="flex items-center gap-2"
                    >
                      <HiOutlineUserCircle className="text-2xl text-gray-600 cursor-pointer" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem onPress={() => navigate("/profile")}>
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar.url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
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
                  className="flex items-center gap-2 text-white transition-colors duration-300 hover:bg-blue-600"
                  onPress={() => navigate("/login")}
                >
                  <HiOutlineLogin className="text-xl" />
                  Sign In
                </Button>
              )}
            </NavbarContent>
          )}
          {/* Toggle Header Visibility Icon */}
          <NavbarItem>
            <Button
              className={`flex items-center gap-2 transition-all duration-500 ${
                isHeaderVisible ? "text-2xl" : "text-xl"
              } bg-white bg-opacity-0`}
              onPress={toggleHeaderVisibility}
            >
              {isHeaderVisible ? (
                <HiOutlineChevronUp className="text-gray-600 cursor-pointer" />
              ) : (
                <HiOutlineChevronDown className="text-gray-600 cursor-pointer" />
              )}
            </Button>
          </NavbarItem>
        </div>
      </Navbar>
      {/* Spacer to prevent content from being hidden behind the navbar */}
      <div
        className={`transition-all duration-500 ${
          isHeaderVisible ? "h-16" : "h-8"
        }`}
      ></div>
    </>
  );
}
