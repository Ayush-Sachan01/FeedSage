"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";
import { Youtube, Menu, X, Loader2 } from "lucide-react";
import { Lightbulb, Star, Shield } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const features = [
  {
    title: "Personalized Feed",
    description: "AI tailors your YouTube recommendations to match your taste.",
    icon: <Lightbulb className="h-8 w-8 text-indigo-400" />,
    lottie: "https://assets2.lottiefiles.com/packages/lf20_tfb3estd.json",
  },
  {
    title: "Smart Recommendations",
    description: "Get content suggestions that align with your learning goals.",
    icon: <Star className="h-8 w-8 text-purple-400" />,
    lottie: "https://assets7.lottiefiles.com/packages/lf20_jcikwtux.json",
  },
  {
    title: "Ad-Free Focus",
    description: "Skip distractions and focus only on valuable content.",
    icon: <Shield className="h-8 w-8 text-pink-400" />,
    lottie: "https://assets10.lottiefiles.com/packages/lf20_w51pcehl.json",
  },
];

function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-20">
      <motion.h2
        className="text-3xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Why Choose FeedSage?
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-gray-900/40 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 mb-4">{f.description}</p>
            <Player
              autoplay
              loop
              src={f.lottie}
              style={{ height: "150px", width: "150px" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-black/70 border-b border-indigo-900 p-4 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Youtube className="text-indigo-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
              FeedSage
            </span>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="text-indigo-300" />
              ) : (
                <Menu className="text-indigo-300" />
              )}
            </Button>
          </div>

          {/* Desktop Nav (optional links) */}
          <div className="hidden md:flex space-x-6 text-gray-300">
            <Link href="/features" className="hover:text-indigo-400">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-indigo-400">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-indigo-400">
              About
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 border-t border-indigo-900 mt-2 px-6 py-4 space-y-3">
            <Link href="/features" className="block text-gray-300 hover:text-indigo-400">
              Features
            </Link>
            <Link href="/pricing" className="block text-gray-300 hover:text-indigo-400">
              Pricing
            </Link>
            <Link href="/about" className="block text-gray-300 hover:text-indigo-400">
              About
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-28">
        <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600"
              variants={fadeInUp}
            >
              Elevate Your YouTube Experience
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-400 mb-8"
              variants={fadeInUp}
            >
              Harness the power of AI to curate your perfect YouTube feed.
            </motion.p>

            <motion.div variants={fadeInUp}>
              {isSignedIn ? (
                <>
                  <Link href="/userprompt">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-indigo-500/30"
                      onClick={handleButtonClick}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Loading...
                        </div>
                      ) : (
                        "Start Your Journey"
                      )}
                    </Button>
                  </Link>

                  {/* Success message */}
                  <div className="mt-4 bg-green-900/30 border border-green-600 text-green-300 px-4 py-3 rounded-lg">
                    <p className="font-semibold">🎉 You are successfully logged in!</p>
                  </div>
                </>
              ) : (
                <Link href="/sign-in">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-indigo-500/30"
                    onClick={handleButtonClick}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Loading...
                      </div>
                    ) : (
                      "Start Your Journey"
                    )}
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Right Animation */}
          <motion.div
            className="md:w-1/2 bg-gray-900/40 rounded-2xl p-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Player
              autoplay
              loop
              src="https://assets3.lottiefiles.com/packages/lf20_qp1q7mct.json"
              style={{ height: "400px", width: "100%" }}
            />
          </motion.div>
        </section>
        <FeaturesSection />
      </main>
    </div>
  );
}
