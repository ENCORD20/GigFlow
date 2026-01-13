import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, User, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidMessage, setBidMessage] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGigDetails = async () => {
    try {
      const { data } = await axios.get(`/gigs/${id}`);
      setGig(data);
    } catch (error) {
      toast.error('Failed to load gig details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const { data } = await axios.get(`/bids/${id}`);
      setBids(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  useEffect(() => {
    if (gig && user && gig.ownerId._id === user._id) {
      fetchBids();
    }
  }, [gig, user]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/bids', {
        gigId: id,
        message: bidMessage,
        price: bidPrice,
      });
      toast.success('Bid placed successfully!');
      setBidMessage('');
      setBidPrice('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    }
  };
  
  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) return;
    
    try {
      await axios.patch(`/bids/${bidId}/hire`);
      toast.success('Freelancer hired successfully!');
      fetchGigDetails();
      fetchBids();
    } catch (error) {
      console.error('FRONTEND HIRE ERROR:', error);
      toast.error(error.response?.data?.message || 'Failed to hire freelancer');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!gig) return null;

  const isOwner = user && gig.ownerId._id === user._id;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Back Button */}
        <div className="col-span-full mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        {/* Left Column: Gig Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
               <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {gig.title}
               </h1>
               <div className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border ${
                 gig.status === 'open' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
               }`}>
                 {gig.status === 'open' ? 'Open for Bids' : 'Assigned'}
               </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>Posted by <span className="text-white font-medium">{gig.ownerId.name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-green-400 font-medium px-3 py-1 bg-green-500/10 rounded-lg">
                <DollarSign className="w-5 h-5" />
                {gig.budget.toLocaleString()} Budget
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-gray-300 font-medium text-lg mb-3">Project Description</h3>
              <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>
          </div>

          {/* Bids List (For Owner) */}
          {isOwner && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                Received Bids
                <span className="text-sm font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                  {bids.length}
                </span>
              </h3>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {bids.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bids received yet.</p>
                  ) : (
                    bids.map((bid, index) => (
                      <motion.div
                        key={bid._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border transition-all ${
                          bid.status === 'hired'
                            ? 'bg-purple-500/10 border-purple-500/30'
                            : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <div>
                             <h4 className="font-semibold text-lg text-white">{bid.freelancerId.name}</h4>
                             <p className="text-sm text-gray-400">{bid.freelancerId.email}</p>
                           </div>
                           <div className="text-xl font-bold text-green-400">
                             ${bid.price}
                           </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6 bg-black/20 p-4 rounded-xl">
                          "{bid.message}"
                        </p>

                        <div className="flex justify-end gap-3">
                          {bid.status === 'pending' && gig.status === 'open' && (
                            <button
                              onClick={() => handleHire(bid._id)}
                              className="flex items-center gap-2 px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Hire Freelancer
                            </button>
                          )}
                          {bid.status === 'hired' && (
                             <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/20 font-medium">
                               <CheckCircle className="w-4 h-4" />
                               Hired
                             </div>
                          )}
                          {bid.status === 'rejected' && (
                            <div className="flex items-center gap-2 px-4 py-2 text-gray-500 font-medium">
                              <XCircle className="w-4 h-4" />
                              Not Selected
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column: Bid Form (For Freelancer) */}
        {!isOwner && gig.status === 'open' && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-1"
           >
             <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 rounded-3xl p-8 sticky top-8 backdrop-blur-xl">
               <h3 className="text-xl font-bold mb-2">Interested?</h3>
               <p className="text-gray-400 text-sm mb-6">
                 Send a proposal to the client. Stand out with a good pitch!
               </p>

               <form onSubmit={handlePlaceBid} className="space-y-4">
                 <div>
                   <label className="text-sm font-medium text-gray-300 block mb-2">Your Price ($)</label>
                   <input
                     type="number"
                     value={bidPrice}
                     onChange={(e) => setBidPrice(e.target.value)}
                     className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 outline-none text-white transition-colors"
                     placeholder="e.g. 4500"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="text-sm font-medium text-gray-300 block mb-2">Cover Letter</label>
                   <textarea
                     value={bidMessage}
                     onChange={(e) => setBidMessage(e.target.value)}
                     className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 outline-none text-white h-32 resize-none transition-colors"
                     placeholder="I am perfect for this because..."
                     required
                   />
                 </div>

                 <button
                   type="submit"
                   className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
                 >
                   <Send className="w-4 h-4" />
                   Submit Proposal
                 </button>
               </form>
             </div>
           </motion.div>
        )}

        {/* Status Banner when Closed */}
        {!isOwner && gig.status !== 'open' && (
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-1"
           >
             <div className="bg-gray-800/40 border border-white/5 rounded-3xl p-8 text-center">
               <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertCircle className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-gray-300 mb-2">Applications Closed</h3>
               <p className="text-gray-500">
                 This gig has been assigned to a freelancer and is no longer accepting bids.
               </p>
             </div>
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default GigDetails;
