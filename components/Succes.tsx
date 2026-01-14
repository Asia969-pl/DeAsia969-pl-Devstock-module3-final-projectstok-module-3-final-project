import CheckCircle from "./CheckCircle";
export default function Succes() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4 gap-10">
      <CheckCircle />
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-[44px] font-extrabold">Thank you!</h1>
        <h2  className="text-[24px] font-medium">You have succesfully register</h2>
        <p className="text-[18px] font-normal" >
          Please check your e-mail for further information. Let’s exploring our
          products and enjoy many gifts.
        </p>
        <p className="text-[18px] font-normal">
          Having problem? <span className="text-[#F7B87A]">Contact us</span>
        </p>
      </div>
    </div>
  );
}
