import FooterLogo from "./FooterLogo";
import PaymentLogoContainer from "./PaymentLogoContainer";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 dark:bg-{#} text-gray-900  dark:bg-[#222327]   dark:text-neutral-300">
      <div
        className="
          max-w-[1820px]
          mx-auto
          px-4 sm:px-8 sm:py-25 lg:px-10
          py-12
          flex flex-col
          gap-10
          sm:flex-row
          sm:justify-between
        "
      >
        {/* LEWA KOLUMNA */}
        <div className="flex flex-col gap-6">
          {/* logo – responsywne */}
          <div className="w-[180px] sm:w-[300px] lg:w-[531.75px]">
            <FooterLogo />
          </div>

          {/* copyright */}
          <div className="text-[16px]">
            <p>© 2023 NexusHub. All</p>
            <p> rights reserved.</p>
          </div>

          <PaymentLogoContainer />
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-32">
          <div className="flex flex-col gap-8">
            <h3 className="text-[20px] font-bold">Company</h3>

            <div className="flex flex-col gap-4 font-semibold">
              <a href="#">
                About Us
              </a>
              <a href="#" >
                Contact
              </a>
              <a href="#">
                Partner
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-8">
          <h3 className="text-[20px] font-semibold">Social</h3>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#">
                Instagram
              </a>
              <a href="#" >
                Twitter
              </a>
              <a href="#" >
                Facebook
              </a>
              <a href="#" >
                Linkedin
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-8">
          <h3 className="text-[20px] font-semibold">FAQ</h3>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" >
                Facebook
              </a>
              <a href="#" >
                Instagram
              </a>
              <a href="#" >
                Twitter
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-8">
          <h3 className="text-[20px] font-semibold">Resources</h3>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" >
                E-books
              </a>
              <a href="#" >
                Tutorials
              </a>
              <a href="#">
                Course
              </a>
              <a href="#" >
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
