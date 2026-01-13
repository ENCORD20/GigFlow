import Bid from '../models/bidModel.js';
import Gig from '../models/gigModel.js';
import mongoose from 'mongoose';

// @desc    Place a bid on a gig
// @route   POST /api/bids
// @access  Private
export const placeBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
       return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    if (gig.status !== 'open') {
        return res.status(400).json({ message: 'This gig is no longer open' });
    }

    const bidExists = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (bidExists) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ message: 'Invalid bid data', error: error.message });
  }
};

// @desc    Get bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Only the owner can see all bids? Or freelancers can see them too?
    // Requirement says: "Review: The Client who posted the job sees a list of all Bids."
    // Usually only owner sees bids to prevent undercutting, but user can define.
    // I will allow owner to see all details.
    
    // For now, let's allow fetching.
    if (gig.ownerId.toString() !== req.user._id.toString()) {
        // If not owner, maybe generic list or just my bid? 
        // For simplicity towards the requirement, I'll restrict to owner for "Review" purpose.
        return res.status(403).json({ message: 'Only the gig owner can view bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Hire a freelancer (Atomic Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig Owner Only)
export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    
    // 1. Find the bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Bid not found' });
    }

    // 2. Find the gig
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Gig associated with bid not found' });
    }

    // 3. Authorization check
    if (gig.ownerId.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // 4. Race Condition Check: Is gig still open?
    if (gig.status !== 'open') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Gig is already assigned' });
    }

    // 5. Perform Updates
    // Mark bid as hired
    bid.status = 'hired';
    await bid.save({ session });

    // Mark gig as assigned
    gig.status = 'assigned';
    await gig.save({ session });

    // Reject all other bids for this gig
    await Bid.updateMany(
        { gigId: gig._id, _id: { $ne: bid._id } },
        { status: 'rejected' }
    ).session(session);

    // 6. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // 7. Emit Real-time Notification
    const io = req.app.get('io');
    if (io) {
        io.to(bid.freelancerId.toString()).emit('notification', {
            type: 'hired',
            message: `Congratulations! You have been hired for the project: ${gig.title}`,
            gigId: gig._id,
        });
    }

    res.json({ message: 'Freelancer hired successfully', bid });

  } catch (error) {
    if (session.inTransaction()) {
        await session.abortTransaction();
    }
    session.endSession();
    console.error('SERVER HIRE ERROR:', error);
    res.status(500).json({ message: 'Transaction failed: ' + error.message, error: error.message });
  }
};

// @desc    Get gigs where the user is hired
// @route   GET /api/bids/my-projects
// @access  Private
export const getMyHiredGigs = async (req, res) => {
  try {
    const bids = await Bid.find({ 
      freelancerId: req.user._id, 
      status: 'hired' 
    })
    .populate({
      path: 'gigId',
      populate: { path: 'ownerId', select: 'name email' }
    })
    .sort({ updatedAt: -1 });

    const gigs = bids.map(bid => ({
        ...bid.gigId.toObject(),
        myBidPrice: bid.price, // Optional extra info
    }));

    res.json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
