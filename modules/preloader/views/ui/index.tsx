import Logo from "@/components/logo";

export default function Preloader() {
  return (
    <div className="flex bg-background items-center justify-center absolute h-full w-full z-[999999] top-0 left-0 right-0">
      {/* <div className="place-items-center space-y-4"> */}
      {/* <Logo className="h-10 w-10 rounded-xl !bg-accent !border !text-primary" /> */}
      <div className="relative flex items-center justify-center w-20 h-[5px] rounded-[2.5px] overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-10"></div>
        <div className="absolute inset-0 bg-primary rounded-[2.5px] animate-wobble"></div>
      </div>
      {/* </div> */}
    </div>
  );
}
