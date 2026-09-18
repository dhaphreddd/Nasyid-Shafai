import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari nasyid...',
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-400/20 shadow-sm transition-all font-medium"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 bg-gray-100 rounded-full p-0.5" />
        </button>
      )}
    </div>
  );
};
