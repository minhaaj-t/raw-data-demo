import SigninWithPassword from "../SigninWithPassword";

interface SigninProps {
  credentials?: { email: string; password: string };
}

export default function Signin({ credentials }: SigninProps = {}) {
  return (
    <div>
      <SigninWithPassword credentials={credentials} />
    </div>
  );
}
