"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";
import { Youtube, Menu, X, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track button loading state

  const handleButtonClick = () => {
    setIsLoading(true); // Set loading state to true when clicked
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="bg-black border-b border-indigo-900 p-4 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
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
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="text-indigo-300" /> : <Menu className="text-indigo-300" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between md:ml-8">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
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
            <motion.p className="text-xl text-indigo-300 mb-8" variants={fadeInUp}>
              Harness the power of AI to curate your perfect YouTube feed.
            </motion.p>
            <motion.div variants={fadeInUp}>
              {isSignedIn ? (
                <>
                  <Link href="/userprompt">
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg"
                      onClick={handleButtonClick}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        "Start Your Journey"
                      )}
                    </Button>
                  </Link>
                  {/* Success message after login */}
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">🎉 You are successfully logged in!</p>
                  </div>
                </>
              ) : (
                <Link href="/sign-in">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg"
                    onClick={handleButtonClick}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      "Start Your Journey"
                    )}
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
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
      </main>
    </div>
  );
}
