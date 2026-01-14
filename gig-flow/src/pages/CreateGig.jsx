import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CreateGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/gigs', { title, description, budget });
      toast.success('Gig posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to post gig');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-purple-900/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-900/20 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-8 left-8 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            New Opportunity
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Post a New Gig
          </h1>
          <p className="text-gray-400 mt-2">
            Describe your project and find the perfect talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-white placeholder-gray-500 text-lg"
              placeholder="e.g. Build a React Web App"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-white placeholder-gray-500 min-h-[150px] resize-none text-lg"
              placeholder="Detail the requirements, deliverables, and timeline..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Budget (USD)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-white placeholder-gray-500 text-lg"
                placeholder="5000"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-bold text-lg rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-4"
          >
            Publish Gig
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateGig;
