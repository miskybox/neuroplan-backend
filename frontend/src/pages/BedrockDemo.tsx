import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BedrockDemo } from "@/components/BedrockDemo";

const BedrockDemoPage = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="container py-12 lg:py-16">
        <BedrockDemo showTitle={true} />
      </main>
      
      <Footer />
    </div>
  );
};

export default BedrockDemoPage;