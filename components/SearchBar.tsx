
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchQuery: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex-grow max-w-md mx-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
    >
      <div className="relative">
        <Input
          type="search"
          placeholder="Search"
          className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-0 top-0 bg-gray-600 hover:bg-gray-500"
          disabled={loading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
