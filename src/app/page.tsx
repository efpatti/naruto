"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CharacterData {
  id: number;
  name: string;
  images: string[];
  natureType: string[];
}

const ITEMS_PER_PAGE = 20;
const MAX_PAGES = 10;

function Home() {
  const [characterData, setCharacterData] = useState<CharacterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  const handleImageError = (id: number) => {
    setErrorImages((prev) => new Set(prev.add(id)));
  };

  useEffect(() => {
    const fetchData = async (page: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://narutodb.xyz/api/character?limit=${ITEMS_PER_PAGE}&page=${page}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar dados");
        }
        const responseData = await response.json();
        setCharacterData(responseData.characters);
        setTotalPages(Math.min(responseData.totalPages, MAX_PAGES));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados do personagem");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen container">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characterData.map((item) => (
            <div
              key={item.id}
              className={
                errorImages.has(item.id)
                  ? "hidden"
                  : "bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              }
            >
              <div className="w-full h-64 relative">
                {/* Define a altura fixa */}
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  priority
                  onError={() => handleImageError(item.id)}
                />
              </div>
              <div className="p-4 flex items-center justify-center">
                <h2 className="text-xl font-semibold">{item.name}</h2>
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <button
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  } hover:bg-blue-400 transition-colors duration-200`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </PaginationItem>
            ))}
            <PaginationNext
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
