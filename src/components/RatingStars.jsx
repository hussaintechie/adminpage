import { Star } from 'lucide-react'

export default function RatingStars({ rating }) {
  if (!rating || rating === 0) return <span className="text-slate-400 text-xs">-</span>;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className={`${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} mr-0.5`} 
        />
      ))}
    </div>
  );
}
