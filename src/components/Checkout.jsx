'use client';
import { useCallback, useState } from 'react';
import api from '@/api';
import { useToast } from '@/context/toastContext';
import useBookingStore from '@/store/booking.store';
import useCartStore from '@/store/cart.store';
import { ButtonLoader } from './loading';

const Checkout = () => {
  const [promocode, setPromocode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { showError, showSuccess, showWarning } = useToast();
  const { applyDiscount, discount, discountPercentage } = useCartStore();
  const { name, email, termsAccepted, setName, setEmail, setTermsAccepted } =
    useBookingStore();

  const handleApplyPromo = useCallback(async () => {
    try {
      const code = promocode.trim().toUpperCase();
      if (!code) return;

      if (code.length < 3) {
        showWarning('The code you entered does not exists');
        return;
      }
      setIsApplying(true);
      const resp = await api.post('/promo/validate', {
        promocode: code,
      });
      showSuccess(resp.data.message);
      applyDiscount(
        resp.data.data.discountPercentage,
        resp.data.data._id,
        code
      );
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setTimeout(() => {
        setIsApplying(false);
      }, 1500);
    }
  }, [promocode]);

  return (
    <div className="flex flex-1 lg:flex-3 flex-col gap-3 sm:gap-5 bg-gray-200 sm:px-6 p-4 rounded-lg h-fit">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="name" className="text-sm sm:text-base">
            Full name
          </label>
          <input
            type="text"
            name=""
            id="name"
            placeholder="Your name"
            className="py-2 px-2 w-full  text-sm sm:text-base"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="email" className="text-sm sm:text-base">
            Email
          </label>
          <input
            type="email"
            name=""
            className="py-2 px-2 w-full text-sm sm:text-base"
            placeholder="Your email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>
      <p className="text-gray-500 text-xs -mb-2 ml-1">
        Apply <span className="text-green-500">'BOOKITNOV'</span> For instant
        15% Discount
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <input
          onChange={e => setPromocode(e.target.value.trim().toUpperCase())}
          type="text"
          placeholder="Promo code"
          className="py-2 px-2 w-full sm:w-[70%] text-sm sm:text-base"
          value={promocode}
          disabled={isApplying}
        />
        <span
          onClick={isApplying || !promocode ? null : handleApplyPromo}
          className={` ${
            isApplying || !promocode
              ? 'muted cursor-not-allowed'
              : 'cursor-pointer'
          }  px-3 py-2 flex-1 rounded-md text-center bg-black text-amber-100 text-sm sm:text-base`}
        >
          {isApplying ? (
            <ButtonLoader text="Applying" spinnerColor="yellow" />
          ) : (
            'Apply'
          )}
        </span>
      </div>
      {discount > 0 ? (
        <p className="text-green-500 text-sm -mt-2 ml-1">
          ✓ Promo code applied! You saved ₹{discount} ({discountPercentage}%
          off)
        </p>
      ) : (
        ''
      )}
      <div className="flex gap-2">
        <input
          type="checkbox"
          name="tnc"
          id="tnc"
          className="cursor-pointer bg-black"
          checked={termsAccepted}
          onChange={e => setTermsAccepted(e.target.checked)}
        />
        <label htmlFor="tnc" className="text-gray-600 text-xs sm:text-sm">
          I agree to the terms and safety policy
        </label>
      </div>
    </div>
  );
};

export default Checkout;
