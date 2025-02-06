import { Fragment } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideCategoryBar from "@/components/SideCategoryBar";
import FeaturedSection from "@/components/FeaturedSection";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-neutral-200 pt-2">
      <Header />
      <div className="flex gap-2 max-w-[1800px] justify-center mx-auto">
        <SideCategoryBar position="left" />
        <div className="md:min-w-[800px] w-full max-w-[900px] shadow-md">
          {children}
          <FeaturedSection />
        </div>
        <SideCategoryBar position="right" />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
