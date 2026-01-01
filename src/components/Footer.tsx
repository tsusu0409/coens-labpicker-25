import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#ddd] py-8 px-4 mt-16 md:py-6 md:mt-8">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-black font-semibold text-base uppercase tracking-wider mb-2 md:text-sm">
            Contact
          </h3>
          <p className="text-black text-sm md:text-[0.85rem]">
            © Tsubasa KAWAGISHI
          </p>
          <p className="text-black text-sm md:text-[0.85rem]">
            Email:{" "}
            <a 
              href="mailto:tsusu0409@gmail.com" 
              className="text-[#60a5ff] hover:text-[#93c5fd] hover:underline transition-colors"
            >
              tsusu0409@gmail.com
            </a>
          </p>
          <p className="text-black text-sm md:text-[0.85rem]">
            Web:{" "}
            <a 
              href="https://tsusu0409.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#60a5ff] hover:text-[#93c5fd] hover:underline transition-colors"
            >
              tsusu0409.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;