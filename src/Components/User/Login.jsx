import React from "react";
import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../utils/helpers";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await apiClient.post("/user/login", { email, password });
      if (data.message === "success") {
        setPassword("");
        setEmail("");
      }

      authenticate(data, () => {
        window.dispatchEvent(new Event("user-logged-in"));
        navigate("/");
        toast.success("Login successful");
      });
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await registerWithGoogle(
      result.user.email,
      result.user.displayName,
      result.user.photoURL
    );
  };

  const registerWithGoogle = async (email, displayName, photoURL) => {
    try {
      const { data } = await apiClient.post(`/auth/google`, {
        email: email,
        name: displayName,
        avatar: photoURL,
      });
      authenticate(data, () => {
        window.dispatchEvent(new Event("user-logged-in"));
        navigate("/");
        toast.success("Login successful");
      });
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

return (
  <div className="flex min-h-screen bg-gradient-to-tr from-green-400 to-blue-500">
    <div className="flex flex-col md:flex-row w-full">
      {/* Left Side - Welcome */}
      <div className="flex w-full md:w-1/2 items-center justify-center py-12 md:py-0">
        <div className="text-white text-center md:ml-16 animate-fade-in px-4">
          <h1 className="text-3xl md:text-4xl font-bold animate-bounce">Welcome Back</h1>
          <p className="mt-4 text-base md:text-lg animate-pulse">
            Log in to your account to continue
          </p>
        </div>
      </div>
      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center py-8 md:py-0">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-4 md:px-8 pb-10 pt-6 mt-0 md:mt-16 bg-white shadow-lg">
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
            />

            <Input
              isRequired
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              value={password}
              onValueChange={setPassword}
            />

            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm">
                Remember me
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" color="primary" type="submit">
              Sign In
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
              onPress={doSignInWithGoogle}
            >
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href="register" size="sm">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
