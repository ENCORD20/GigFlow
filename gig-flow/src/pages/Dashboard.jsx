import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GigCard from '../components/GigCard';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Search, Briefcase, Sparkles, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGigs = async (searchQuery = '') => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/gigs?search=${searchQuery}`);
      setGigs(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
        const { data } = await axios.get('/bids/my-projects');
        setMyProjects(data);
    } catch (error) {
        console.error('Failed to load my projects', error);
    }
  };

  useEffect(() => {
    fetchGigs();
    fetchMyProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(search);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              GigFlow
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm text-gray-400">Signed in as</span>
              <span className="font-medium text-white">{user?.name}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
            
            <button
              onClick={() => navigate('/create-gig')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Gig</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* Hero & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">dream project</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Connect with top clients and talented freelancers in real-time.
          </p>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title (e.g., 'React Developer')..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-white placeholder-gray-500 backdrop-blur-sm"
            />
          </form>
        </motion.div>
        
        {/* My Projects Section */}
        {myProjects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-green-400 uppercase tracking-wider mb-6">
                 <CheckCircle className="w-4 h-4" />
                 My Active Projects
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map((gig, index) => (
                   <div key={gig._id} className="relative group">
                      {/* Subtle Active Border */}
                      <div className="absolute inset-0 border-2 border-green-500/20 rounded-3xl pointer-events-none z-20" />
                      
                      <GigCard gig={gig} index={index} isHired={true} />
                      
                      {/* Cleaner Badge */}
                      <div className="absolute top-4 right-4 bg-green-900/40 backdrop-blur-md text-green-400 border border-green-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </div>
                   </div>
                ))}
              </div>
            </motion.div>
        )}

        {/* Content Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Latest Gigs
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {loading ? (
                // Loading Skeletons
                [...Array(6)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5"
                  />
                ))
              ) : gigs.length > 0 ? (
                gigs.map((gig, index) => (
                  <GigCard key={gig._id} gig={gig} index={index} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Gigs Found</h3>
                  <p className="text-gray-400">Try adjusting your search terms or post your own!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
