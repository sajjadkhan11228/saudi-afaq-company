
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* First: Main Hero Section */}
        <Hero />

        {/* Second: Projects and Work Images */}
        <Projects />

        {/* Other Information Below */}
        <About />
        <Services />
      </main>

      <Footer />
    </>
  );
}
