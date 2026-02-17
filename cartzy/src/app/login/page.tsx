import LoginForm from "@/components/LoginForm";
import Welcome from "@/components/Welcome";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <Welcome />
      <LoginForm />
    </div>
  );
}
