import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const { id } = useParams();
  return (
    <div className="section container-custom max-w-lg mx-auto text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-400" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-3xl font-display font-bold text-espresso-900 dark:text-cream-50 mb-3">Order Placed! ?</h1>
        <p className="text-espresso-500 dark:text-espresso-400 mb-8">Thank you for your order. You'll receive a confirmation email shortly.</p>
        <div className="flex gap-3 justify-center">
          <Link to={'/dashboard/orders/' + id} className="btn btn-primary"><Package className="w-4 h-4" />Track Order</Link>
          <Link to="/" className="btn btn-outline"><Home className="w-4 h-4" />Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
