"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PARISHES, PROPERTY_TYPES, BEDROOM_OPTIONS, BATHROOM_OPTIONS, PRICE_RANGES } from "@/lib/constants"
import { X } from "lucide-react"

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void
}

export interface PropertyFilters {
  parishes: string[]
  propertyTypes: string[]
  bedrooms: string[]
  bathrooms: string[]
  priceRange: string
  status: string[]
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFilters>({
    parishes: [],
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    priceRange: "",
    status: ["active", "new"],
  })

  const handleParishToggle = (parish: string) => {
    const newParishes = filters.parishes.includes(parish)
      ? filters.parishes.filter(p => p !== parish)
      : [...filters.parishes, parish]
    
    const newFilters = { ...filters, parishes: newParishes }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type]
    
    const newFilters = { ...filters, propertyTypes: newTypes }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleBedroomsChange = (value: string) => {
    const newFilters = { ...filters, bedrooms: value === 'any' ? [] : [value] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleBathroomsChange = (value: string) => {
    const newFilters = { ...filters, bathrooms: value === 'any' ? [] : [value] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (value: string) => {
    const newFilters = { ...filters, priceRange: value === 'any' ? '' : value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: PropertyFilters = {
      parishes: [],
      propertyTypes: [],
      bedrooms: [],
      bathrooms: [],
      priceRange: "",
      status: ["active", "new"],
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const hasActiveFilters = 
    filters.parishes.length > 0 ||
    filters.propertyTypes.length > 0 ||
    filters.bedrooms.length > 0 ||
    filters.bathrooms.length > 0 ||
    filters.priceRange !== ""

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-caribbean-navy">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-caribbean-gold hover:text-caribbean-gold/80"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Parish Filter */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-caribbean-navy mb-3 block">
          Parish
        </Label>
        <div className="space-y-2">
          {PARISHES.map((parish) => (
            <div key={parish} className="flex items-center">
              <Checkbox
                id={`parish-${parish}`}
                checked={filters.parishes.includes(parish)}
                onCheckedChange={() => handleParishToggle(parish)}
                className="border-caribbean-navy data-[state=checked]:bg-caribbean-gold data-[state=checked]:border-caribbean-gold"
              />
              <label
                htmlFor={`parish-${parish}`}
                className="ml-2 text-sm cursor-pointer text-gray-700 hover:text-caribbean-navy"
              >
                {parish}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Property Type Filter */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-caribbean-navy mb-3 block">
          Property Type
        </Label>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={`type-${type}`}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => handlePropertyTypeToggle(type)}
                className="border-caribbean-navy data-[state=checked]:bg-caribbean-gold data-[state=checked]:border-caribbean-gold"
              />
              <label
                htmlFor={`type-${type}`}
                className="ml-2 text-sm cursor-pointer text-gray-700 hover:text-caribbean-navy"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bedrooms Filter */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-caribbean-navy mb-3 block">
          Bedrooms
        </Label>
        <Select onValueChange={handleBedroomsChange} value={filters.bedrooms[0] || "any"}>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {BEDROOM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms Filter */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-caribbean-navy mb-3 block">
          Bathrooms
        </Label>
        <Select onValueChange={handleBathroomsChange} value={filters.bathrooms[0] || "any"}>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {BATHROOM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-caribbean-navy mb-3 block">
          Price Range
        </Label>
        <Select onValueChange={handlePriceRangeChange} value={filters.priceRange || "any"}>
          <SelectTrigger className="border-gray-300">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Price</SelectItem>
            {PRICE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}