import ResetPasswordForm from './components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-purple-200 via-white to-transparent pointer-events-none z-0" />
      <ResetPasswordForm />
    </div>
  );
}
