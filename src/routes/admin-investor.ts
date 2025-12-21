import { Hono } from 'hono';
import { approveInvestor, rejectInvestor, getInvestorDetails } from '../api/admin/investor-actions';

const adminInvestorRoute = new Hono();

// Approve investor (change status from nda_signed to active)
adminInvestorRoute.post('/investor/:investor_id/approve', approveInvestor);

// Reject investor (change status to rejected)
adminInvestorRoute.post('/investor/:investor_id/reject', rejectInvestor);

// Get investor details including NDA signature
adminInvestorRoute.get('/investor/:investor_id/details', getInvestorDetails);

export default adminInvestorRoute;
