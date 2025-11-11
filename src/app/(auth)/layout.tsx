import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="size-full flex trans-c">
      <div className="relative w-full md:w-[400px] flex-center">{children}</div>
      <div className="relative max-md:hidden flex-1 flex-center bg-area select-none">
        <Image
          src="/images/icons/icon.svg"
          className="fade"
          width={256}
          height={256}
          priority
          quality={100}
          unoptimized
          alt="Photo"
        />
      </div>
    </div>
  );
}
