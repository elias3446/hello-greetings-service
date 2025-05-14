import * as React from "react";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { Icons } from "@/components/Icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (icon: string) => void;
}

export function IconPicker({ open, onOpenChange, onSelect }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const iconsPerPage = 100;

  const filteredIcons = Object.keys(Icons)
    .filter((iconName) => 
      iconName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
  const paginatedIcons = filteredIcons.slice(
    (currentPage - 1) * iconsPerPage,
    currentPage * iconsPerPage
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar Icono</DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar iconos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-1">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 py-4">
            {paginatedIcons.length > 0 ? (
              paginatedIcons.map((iconName) => {
                const Icon = Icons[iconName];
                return (
                  <Button
                    variant="outline"
                    key={iconName}
                    className="h-14 flex flex-col gap-1 py-1 hover:bg-accent"
                    onClick={() => {
                      onSelect?.(iconName);
                      onOpenChange(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] text-muted-foreground truncate w-full px-1">
                      {iconName}
                    </span>
                  </Button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                No se encontraron iconos
              </div>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  →
                </Button>
              </div>
            </Pagination>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
