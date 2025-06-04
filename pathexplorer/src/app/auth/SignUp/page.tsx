import SignUpForm from './components/signUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="fixed inset-0 bg-gradient-to-br from-white via-white to-purple-50 z-0" />
      <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-100 to-transparent opacity-50 z-0" />
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-50 to-transparent opacity-50 z-0" />

      <SignUpForm />
    </div>
  );
}
