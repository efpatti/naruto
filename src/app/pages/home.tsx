"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CharacterData {
  id: number; // Adicionando um ID único para cada personagem
  name: string;
  images: string[];
  natureType: string[];
}

const ITEMS_PER_PAGE = 20;
const MAX_PAGES = 10;

export function Home() {
  const [characterData, setCharacterData] = useState<CharacterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = (page: number) => {
      setIsLoading(true);
      fetch(
        `https://narutodb.xyz/api/character?limit=${ITEMS_PER_PAGE}&page=${page}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao carregar dados");
          }
          return response.json();
        })
        .then((responseData) => {
          setCharacterData(responseData.characters);
          setTotalPages(Math.min(responseData.totalPages, MAX_PAGES));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados:", error);
          toast.error("Erro ao carregar dados do personagem");
          setIsLoading(false);
        });
    };

    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {isLoading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        characterData.map((item: CharacterData) => (
          <div key={item.id} className="rounded-xl bg-gray-800 text-white p-4">
            <div className="grid grid-rows-2 place-content-center justify-items-center">
              <p className="text-lg">{item.name}</p>
              <Image
                src={item.images[0]}
                alt=""
                width={150}
                height={150}
                className="h-auto w-auto"
                priority={true}
              />
            </div>
          </div>
        ))
      )}
      <div className="flex justify-center items-center mt-4">
        <PaginationPrevious
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <a
              className={`pagination-link ${
                currentPage === index + 1 ? "font-bold" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </a>
          </PaginationItem>
        ))}
        <PaginationNext
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
}
