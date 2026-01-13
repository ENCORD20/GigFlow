import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Clock, User, ArrowRight } from 'lucide-react';

const GigCard = ({ gig, index, isHired = false }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white/5 backdrop-blur-md rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isHired 
          ? 'hover:bg-green-500/5 hover:shadow-green-500/10' 
          : 'border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-purple-500/10'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        {/* Left Side Content */}
        {isHired ? (
           <span className="text-gray-500 text-xs flex items-center gap-1">
             <Clock className="w-3 h-3" />
             {new Date(gig.updatedAt).toLocaleDateString()} {/* Show when hired updated */}
           </span>
        ) : (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            gig.status === 'open' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
          }`}>
            {gig.status === 'open' ? 'Active Now' : 'Closed'}
          </div>
        )}

        {/* Right Side Content - Hide Date if Hired (since it's now on left) */}
        {!isHired && (
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(gig.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <h3 className={`text-xl font-semibold text-white mb-2 transition-colors line-clamp-1 ${
         isHired ? 'group-hover:text-green-400' : 'group-hover:text-purple-400'
      }`}>
        {gig.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
        {gig.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Budget</span>
          <div className="flex items-center text-white font-medium text-lg">
            <DollarSign className="w-4 h-4 text-green-400" />
            {gig.budget.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => navigate(`/gigs/${gig._id}`)}
          className="p-3 bg-white text-black rounded-xl opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg hover:bg-gray-200"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Conditional Border */}
      {!isHired && (
        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none group-hover:border-purple-500/30 transition-colors" />
      )}
    </motion.div>
  );
};
export default GigCard;
