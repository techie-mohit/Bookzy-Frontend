import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

interface PaginationProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
}

const Pagination :React.FC<PaginationProps> = ({ currentPage, totalPage, onPageChange }) => {
  return (
    <div className='flex items-center justify-center gap-2'>
        <Button variant="outline" size='icon' onClick={()=> onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
        </Button>

        {
            Array.from({length:totalPage}, (_, index)=> index+1).map((page)=> (
                <Button 
                    key={page} 
                    variant={currentPage === page ? 'default' : 'outline'} 
                    size='icon' 
                    className={currentPage === page ? 'bg-blue-500 ' : ''}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))
        }

        <Button variant="outline" size='icon' onClick={()=> onPageChange(Math.min(totalPage, currentPage + 1))} disabled={currentPage === totalPage}>
            <ChevronRight className="h-4 w-4" />
        </Button>
      
    </div>
  )
}

export default Pagination
