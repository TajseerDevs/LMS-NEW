import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

const EmptyCartUI = () => {
  return (
    <motion.div
      className="flex h-[1000px] w-full flex-col items-center justify-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaCartShopping className="h-40 w-40 text-gray-300" /> {/* Bigger icon */}
      <h3 className="text-4xl font-bold text-gray-800">Your cart is empty</h3> {/* Bigger text */}
      <p className="text-lg text-gray-500">
        Looks like you haven't added anything to your cart yet.
      </p>

      <Link
        className="mt-6 rounded-lg bg-emerald-500 px-8 py-3 text-xl text-white transition-colors hover:bg-emerald-600"
        to="/explore-courses"
      >
        Start Shopping
      </Link>
    </motion.div>
  );
};

export default EmptyCartUI;
