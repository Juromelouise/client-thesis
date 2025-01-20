import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { HiMenu, HiOutlineUserCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleOpen = () => {
    onOpen();
  };

  return (
    <Navbar
      className="fixed top-0 left-0 w-full px-4 shadow-md bg-white z-50"
      maxWidth="fluid"
    >
      <Drawer isOpen={isOpen} size="xs" onClose={onClose}>
        <DrawerContent>
          <div className="flex flex-col gap-4 p-4">
            <DrawerHeader className="text-lg font-semibold">MENU</DrawerHeader>
            <Button
              color="primary"
              variant="light"
              className="w-full text-left"
              onClick={() => {
                navigate("/dashboard");
                onClose();
              }}
            >
              Dashboard
            </Button>
            <Button
              color="primary"
              variant="light"
              className="w-full text-left"
              onClick={() => {
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
              onClick={() => {
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
              onClick={() => {
                navigate("/fyp");
                onClose();
              }}
            >
              FYP
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      {/* Brand */}
      <Link to="/">
        <NavbarBrand>
          <span className="text-xl font-bold text-black">VOBO</span>
        </NavbarBrand>
      </Link>
      {/* Spacer */}
      <NavbarContent justify="end" className="gap-4">
        {/* Menu Icon */}
        <NavbarItem>
          <HiMenu
            className="text-2xl text-gray-600 cursor-pointer"
            onClick={handleOpen}
          />
        </NavbarItem>

        {/* User Icon */}
        <Link to="/profile">
          <NavbarItem>
            <HiOutlineUserCircle className="text-2xl text-gray-600 cursor-pointer" />
          </NavbarItem>
        </Link>
      </NavbarContent>
    </Navbar>
  );
}
