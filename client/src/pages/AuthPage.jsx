import { useLocation, Link, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { AuthForm } from "../components/AuthForm";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function AuthPage() {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";
  const { login, register, error, loading, isAuthenticated } =
    useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e, form) => {
    e.preventDefault();
    if (isLogin) {
      login(form);
    } else {
      register(form);
    }
  };

  return (
    <AuthLayout>
      <AuthForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
      )}
      <p className="mt-4 text-center text-sm text-blue-500">
        {isLogin ? "No account?" : "Already have an account?"}{" "}
        <Link to={isLogin ? "/register" : "/login"} className="hover:underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </AuthLayout>
  );
}
