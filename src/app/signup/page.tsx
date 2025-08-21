import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-background"
      >
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(41,171,226,0.2),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] -translate-y-[10%] translate-x-[10%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(48,213,200,0.2),rgba(255,255,255,0))]"></div>
      </div>
      <AuthForm type="signup" />
    </div>
  );
}
