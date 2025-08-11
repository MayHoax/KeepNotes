export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 hidden lg:block bg-lime-300" />
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
