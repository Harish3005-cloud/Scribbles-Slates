import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId  = params.get('orderId');

  return (
    <div className="page-container py-24 flex flex-col items-center gap-6 text-center animate-fade-in">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle size={48} className="text-success" />
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-800">Order Confirmed!</h1>
        <p className="text-slate mt-2 text-lg">
          Thank you for your purchase from <strong>Scribbles &amp; Slates</strong>
        </p>
        {orderId && (
          <p className="text-xs text-slate mt-2 font-mono">
            Order ID: {orderId}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 max-w-sm w-full space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Package size={18} className="text-ink" />
          <span>Your order is being processed and will be shipped shortly.</span>
        </div>
        <p className="text-xs text-slate">
          A confirmation email will be sent to your registered address.
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <Link to="/" className="btn-primary">
          Continue Shopping <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
