import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideCategoryBar from "@/components/SideCategoryBar";
import FeaturedSection from "@/components/FeaturedSection";
import SideCategoryBar2 from "@/components/SideCategoryBar2";
import Sidebar from "@/components/Sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Sidebar>
      <main className="bg-neutral-200 pt-2">
        <Header />
        <div className="flex gap-2 max-w-[1800px] justify-center mx-auto">
          <SideCategoryBar position="left" />
          <div className="md:min-w-[600px] w-full max-w-[700px] shadow-md">
            {children}
            <FeaturedSection />
          </div>
          <SideCategoryBar2 position="right" />
        </div>
        <Footer />
      </main>
    </Sidebar>
  );
};

export default Layout;
